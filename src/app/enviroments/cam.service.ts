import { Injectable } from '@angular/core';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';


@Injectable({

  providedIn: 'root',
})
export class CamService {
  private streams: Map<string, MediaStream> = new Map();
  private poses: Map<string, Pose> = new Map();
  private cameras: Map<string, Camera> = new Map();
  private canvasElements: Map<string, HTMLCanvasElement> = new Map();

  constructor() {}

  async startCamera(deviceId: string, videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<void> {
    // Parar a câmera se já estiver em uso
    if (this.streams.has(deviceId)) {
      this.stopCamera(deviceId);
    }

    // Criar um novo stream para a câmera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId }, width: 640, height: 480 },
    });
    this.streams.set(deviceId, stream);

    // Conectar o stream ao elemento de vídeo
    videoElement.srcObject = stream;
    await videoElement.play();

    // Inicializar o MediaPipe Pose para esta câmera
    this.initializePose(deviceId, videoElement, canvasElement);
  }

  private initializePose(deviceId: string, videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
    const pose = new Pose({
      locateFile: (file) => {
        // Adiciona um sufixo único ao arquivo para evitar conflitos
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}?${deviceId}`;
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => this.handlePoseResults(deviceId, results, canvasElement));
    this.poses.set(deviceId, pose);

    // Iniciar a câmera do MediaPipe
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await pose.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });

    this.cameras.set(deviceId, camera);
    camera.start();
  }

  private handlePoseResults(deviceId: string, results: Results, canvasElement: HTMLCanvasElement) {
    const ctx = canvasElement.getContext('2d')!;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Desenhar landmarks dos ombros
    if (results.poseLandmarks) {
      this.drawLandmark(ctx, results.poseLandmarks[11], canvasElement); // Ombro esquerdo
      this.drawLandmark(ctx, results.poseLandmarks[12], canvasElement); // Ombro direito

      // Opcional: desenhar linha conectando os ombros
      this.drawShoulderLine(ctx, results.poseLandmarks[11], results.poseLandmarks[12], canvasElement);
    }
  }

  private drawLandmark(ctx: CanvasRenderingContext2D, landmark: any, canvas: HTMLCanvasElement) {
    if (!landmark) return;

    ctx.beginPath();
    ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
  }

  private drawShoulderLine(ctx: CanvasRenderingContext2D, start: any, end: any, canvas: HTMLCanvasElement) {
    if (!start || !end) return;

    ctx.beginPath();
    ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
    ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  stopCamera(deviceId: string): void {
    const stream = this.streams.get(deviceId);
    const camera = this.cameras.get(deviceId);
    const pose = this.poses.get(deviceId);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      this.streams.delete(deviceId);
    }

    if (camera) {
      camera.stop();
      this.cameras.delete(deviceId);
    }

    if (pose) {
      pose.close();
      this.poses.delete(deviceId);
    }

    this.canvasElements.delete(deviceId);
  }
}
