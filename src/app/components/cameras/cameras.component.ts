import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrl: './cameras.component.css'
})
export class CamerasComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  detector?: poseDetection.PoseDetector;
  isDetecting = false;
  statusMessage = 'Inicializando...';
  private isFrontCamera = false;

  async ngOnInit() {
    try {
      await tf.setBackend('webgl');
      await tf.ready();
      await this.startCamera();
      await this.loadModel();
      this.startDetection();
    } catch (error) {
      this.handleError(error);
    }
  }

  private async loadModel() {
    this.statusMessage = 'Carregando modelo...';
    this.detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true
      }
    );
    this.statusMessage = '';
  }

  private async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: this.isFrontCamera ? 'user' : 'environment'
        }
      });

      const video = this.videoElement.nativeElement;
      video.srcObject = stream;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          // Atualiza dimensões reais
          video.width = video.videoWidth;
          video.height = video.videoHeight;
          this.updateCanvasSize();
          resolve();
        };
        video.onerror = reject;
      });

      await video.play();
    } catch (error) {
      throw new Error(`Erro na câmera: ${this.getErrorMessage(error)}`);
    }
  }

  private updateCanvasSize() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    // Sincroniza canvas com o vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }

  private async startDetection() {
    if (!this.detector) return;

    this.isDetecting = true;
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    while (this.isDetecting) {
      if (video.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
        ctx.save();

        // Espelha o canvas para câmera frontal
        if (this.isFrontCamera) {
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
        }

        const poses = await this.detector.estimatePoses(video);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawKeypoints(poses, ctx);

        ctx.restore();
      }
      await tf.nextFrame();
    }
  }

  private drawKeypoints(poses: poseDetection.Pose[], ctx: CanvasRenderingContext2D) {
    for (const pose of poses) {
      for (const keypoint of pose.keypoints) {
        const score = keypoint.score ?? 0;
        if (score > 0.3) {
          ctx.beginPath();
          // Ajusta coordenadas para câmera frontal
          const x = this.isFrontCamera ? ctx.canvas.width - keypoint.x : keypoint.x;
          ctx.arc(x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#FF0000';
          ctx.fill();
        }
      }
    }
  }

  // Método para trocar de câmera
  async switchCamera() {
    this.isDetecting = false;
    this.isFrontCamera = !this.isFrontCamera;

    if (this.videoElement?.nativeElement.srcObject) {
      const stream = this.videoElement.nativeElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      await this.startCamera();
      this.startDetection();
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown) {
    this.statusMessage = `Erro: ${this.getErrorMessage(error)}`;
    console.error(error);
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Erro desconhecido';
  }

  ngOnDestroy() {
    this.isDetecting = false;
    if (this.videoElement?.nativeElement.srcObject) {
      const tracks = (this.videoElement.nativeElement.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  }
}
