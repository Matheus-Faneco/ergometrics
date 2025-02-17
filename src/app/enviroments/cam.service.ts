import { Injectable } from '@angular/core';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';


@Injectable({

  providedIn: 'root',
})
export class CamService {
  private stream: MediaStream | null = null;
  private pose: Pose | null = null;
  private camera: Camera | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private isActive = false;
  private hiddenVideo: HTMLVideoElement;

  constructor() {
    this.hiddenVideo = document.createElement('video');
  }

  async startCamera(
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement
  ): Promise<void> {
    if (this.isActive) return;

    // Configurar elementos
    this.canvas = canvasElement;
    this.canvas.width = 640;
    this.canvas.height = 480;

    // Iniciar stream se não existir
    if (!this.stream) {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
    }

    // Configurar elementos de vídeo
    videoElement.srcObject = this.stream;
    this.hiddenVideo.srcObject = this.stream;
    await Promise.all([videoElement.play(), this.hiddenVideo.play()]);

    // Inicializar processamento de pose
    this.initializePose();
    this.isActive = true;
  }

  private initializePose() {
    this.pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.pose.onResults((results) => this.handleResults(results));

    this.camera = new Camera(this.hiddenVideo, {
      onFrame: async () => {
        await this.pose!.send({ image: this.hiddenVideo });
      },
      width: 640,
      height: 480,
    });

    this.camera.start();
  }

  private handleResults(results: Results) {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d')!;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (results.poseLandmarks) {
      this.drawLandmark(ctx, results.poseLandmarks[11]);
      this.drawLandmark(ctx, results.poseLandmarks[12]);
      this.drawShoulderLine(ctx, results.poseLandmarks[11], results.poseLandmarks[12]);
    }
  }

  private drawLandmark(ctx: CanvasRenderingContext2D, landmark: any) {
    if (!landmark || !this.canvas) return;
    ctx.beginPath();
    ctx.arc(landmark.x * this.canvas.width, landmark.y * this.canvas.height, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
  }

  private drawShoulderLine(ctx: CanvasRenderingContext2D, start: any, end: any) {
    if (!start || !end || !this.canvas) return;
    ctx.beginPath();
    ctx.moveTo(start.x * this.canvas.width, start.y * this.canvas.height);
    ctx.lineTo(end.x * this.canvas.width, end.y * this.canvas.height);
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  updateCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = 640;
    this.canvas.height = 480;
  }

  stopCamera() {
    if (!this.isActive) return;

    this.stream?.getTracks().forEach(track => track.stop());
    this.camera?.stop();
    this.pose?.close();

    this.stream = null;
    this.camera = null;
    this.pose = null;
    this.canvas = null;
    this.isActive = false;
  }

  get cameraStatus(): boolean {
    return this.isActive;
  }
}
