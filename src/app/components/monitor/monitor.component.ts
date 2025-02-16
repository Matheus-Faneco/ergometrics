import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {CamService} from '../../enviroments/cam.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css'
})
export class MonitorComponent implements AfterViewInit{
  @ViewChild('video1') videoElement1!: ElementRef<HTMLVideoElement>;
  @ViewChild('video2') videoElement2!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas1') canvasElement1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2') canvasElement2!: ElementRef<HTMLCanvasElement>;

  cameras: MediaDeviceInfo[] = [];
  selectedCamera1!: string;
  selectedCamera2!: string;

  constructor(private cameraService: CamService) {}

  async ngAfterViewInit() {
    await this.listCameras();
    this.attachExistingStreams();
  }

  private async attachExistingStreams() {
    // Iniciar câmera 1
    if (this.selectedCamera1) {
      await this.cameraService.startCamera(
        this.selectedCamera1,
        this.videoElement1.nativeElement,
        this.canvasElement1.nativeElement
      );
    }

    // Iniciar câmera 2
    if (this.selectedCamera2) {
      await this.cameraService.startCamera(
        this.selectedCamera2,
        this.videoElement2.nativeElement,
        this.canvasElement2.nativeElement
      );
    }
  }

  async listCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.cameras = devices.filter((device) => device.kind === 'videoinput');

      if (this.cameras.length > 0) {
        this.selectedCamera1 = this.cameras[0].deviceId;
        this.selectedCamera2 = this.cameras[1 % this.cameras.length].deviceId;
      }
    } catch (error) {
      console.error('Erro ao listar câmeras:', error);
    }
  }
}
