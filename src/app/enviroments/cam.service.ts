import { Injectable } from '@angular/core';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';


@Injectable({

  providedIn: 'root',
})
export class CamService {
  private streams = new Map<string, MediaStream>();
  private poses = new Map<string, Pose>();
  private cameras = new Map<string, Camera>();
  private canvases = new Map<string, HTMLCanvasElement>();

  async startCamera(
    deviceId: string,
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement
  ): Promise<void> {
    // Parar se já existir
    if (this.streams.has(deviceId)) this.stopCamera(deviceId);

    // Configurar canvas
    canvasElement.width = 640;
    canvasElement.height = 480;
    this.canvases.set(deviceId, canvasElement);

    // Iniciar stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId }, width: 640, height: 480 }
    });
    this.streams.set(deviceId, stream);

    videoElement.srcObject = stream;
    await videoElement.play();

    // Inicializar Pose para esta câmera
    this.initializePose(deviceId, videoElement);
  }

  private initializePose(deviceId: string, videoElement: HTMLVideoElement) {
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}?v=${deviceId}`, // Cache único por câmera
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => this.handleResults(deviceId, results));
    this.poses.set(deviceId, pose);

    // Iniciar processamento de frames
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

  private handleResults(deviceId: string, results: Results) {
    const canvas = this.canvases.get(deviceId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar landmarks dos ombros
    if (results.poseLandmarks) {
      this.drawLandmark(ctx, results.poseLandmarks[11], canvas);  // Ombro esquerdo
      this.drawLandmark(ctx, results.poseLandmarks[12], canvas);  // Ombro direito
      this.drawShoulderLine(ctx, results.poseLandmarks[11], results.poseLandmarks[12], canvas);
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

  stopCamera(deviceId: string) {
    // Limpar todos os recursos
    this.streams.get(deviceId)?.getTracks().forEach(track => track.stop());
    this.cameras.get(deviceId)?.stop();
    this.poses.get(deviceId)?.close();

    this.streams.delete(deviceId);
    this.cameras.delete(deviceId);
    this.poses.delete(deviceId);
    this.canvases.delete(deviceId);
  }
}
