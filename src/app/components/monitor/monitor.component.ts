import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import {CamService} from '../../enviroments/cam.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css'
})
export class MonitorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video1') video1!: ElementRef<HTMLVideoElement>;
  @ViewChild('video2') video2!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas1') canvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2') canvas2!: ElementRef<HTMLCanvasElement>;

  cameras: MediaDeviceInfo[] = [];
  selectedCameras: string[] = [];

  constructor(private camService: CamService) {}

  async ngAfterViewInit() {
    await this.setupCameras();
  }

  private async setupCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.cameras = devices.filter(d => d.kind === 'videoinput');

    if (this.cameras.length >= 2) {
      // Usar as duas primeiras câmeras
      await this.camService.startCamera(
        this.cameras[0].deviceId,
        this.video1.nativeElement,
        this.canvas1.nativeElement
      );

      await this.camService.startCamera(
        this.cameras[1].deviceId,
        this.video2.nativeElement,
        this.canvas2.nativeElement
      );
    }
  }

  ngOnDestroy() {
    this.cameras.forEach(cam => this.camService.stopCamera(cam.deviceId));
  }
}
