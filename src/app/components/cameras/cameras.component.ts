import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  detector?: poseDetection.PoseDetector;
  isDetecting = false;
  statusMessage = 'Inicializando...';
  private isFrontCamera = false;

  // Variáveis para controlar o tempo em que o ângulo está incorreto
  private startIncorrectTime: number | null = null;
  public incorrectDuration: number = 0;

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

        // Espelha o canvas para câmera frontal, se necessário
        if (this.isFrontCamera) {
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
        }

        // Estima a pose a partir do vídeo
        const poses = await this.detector.estimatePoses(video);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawKeypoints(poses, ctx);

        // Se houver alguma pose detectada, processa o ângulo do ombro
        if (poses.length > 0) {
          const pose = poses[0];
          this.processElbowAngle(pose);
        }

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

  /**
   * Processa a pose para calcular o ângulo do ombro e verificar se está correto.
   * Usa os pontos: ombro, cotovelo e quadril (lado direito neste exemplo).
   */
  private processElbowAngle(pose: poseDetection.Pose): void {
    const rightShoulder = pose.keypoints.find(kp => kp.name === 'right_shoulder');
    const rightElbow = pose.keypoints.find(kp => kp.name === 'right_elbow');
    const rightWrist = pose.keypoints.find(kp => kp.name === 'right_wrist');

    if (rightShoulder && rightElbow && rightWrist) {
      // Calcula o ângulo no cotovelo: vértice é o cotovelo (right_elbow)
      const angle = this.calculateAngle(
        rightShoulder.x, rightShoulder.y,
        rightElbow.x, rightElbow.y,
        rightWrist.x, rightWrist.y
      );

      // Exemplo de intervalo para um ângulo considerado correto – ajuste conforme sua necessidade.
      // Por exemplo, para uma boa flexão do cotovelo pode ser que se espere um ângulo entre 30° e 90°.
      const isAngleCorrect = angle >= 0 && angle <= 90;

      if (!isAngleCorrect) {
        // Se o ângulo estiver incorreto, inicia ou continua a contagem do tempo
        if (this.startIncorrectTime === null) {
          this.startIncorrectTime = Date.now();
        }
      } else {
        // Quando o ângulo volta ao normal, calcula a duração que ficou incorreto
        if (this.startIncorrectTime !== null) {
          this.incorrectDuration = Date.now() - this.startIncorrectTime;
          console.log(`Ângulo incorreto por: ${this.incorrectDuration} ms (Angle: ${angle.toFixed(2)}°)`);
          this.handleIncorrectDuration(this.incorrectDuration, angle);
          this.startIncorrectTime = null;
        }
      }
    }
  }
  /**
   * Calcula o ângulo formado pelos pontos A, B e C, onde B é o vértice.
   * Neste caso, A: cotovelo, B: ombro e C: quadril.
   */
  private calculateAngle(
    xA: number, yA: number,
    xB: number, yB: number,
    xC: number, yC: number
  ): number {
    const vectorBA = { x: xA - xB, y: yA - yB };
    const vectorBC = { x: xC - xB, y: yC - yB };

    const dot = vectorBA.x * vectorBC.x + vectorBA.y * vectorBC.y;
    const magBA = Math.sqrt(vectorBA.x ** 2 + vectorBA.y ** 2);
    const magBC = Math.sqrt(vectorBC.x ** 2 + vectorBC.y ** 2);

    if (magBA === 0 || magBC === 0) return 0;

    const cosineAngle = dot / (magBA * magBC);
    // Corrige possíveis imprecisões numéricas limitando o valor entre -1 e 1
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosineAngle)));
    const angleDeg = angleRad * (180 / Math.PI);
    return angleDeg;
  }

  /**
   * Trata a duração registrada com ângulo incorreto.
   * Aqui você pode atualizar a interface ou enviar a informação para outro componente/serviço.
   */
  private handleIncorrectDuration(duration: number, angle: number): void {
    // Exemplo de log; substitua por qualquer ação necessária (ex: atualizar variável de estado, emitir evento, etc.)
    console.log(`O ângulo ${angle.toFixed(2)}° ficou incorreto por ${duration} ms`);
  }

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
