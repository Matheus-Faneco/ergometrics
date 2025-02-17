import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import {CamService} from '../../enviroments/cam.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css'
})
export class MonitorComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  constructor(public camService: CamService) {}

  async ngAfterViewInit() {
    if (this.camService.cameraStatus) {
      await this.reconnectCamera();
    }
  }

  private async reconnectCamera() {
    this.videoElement.nativeElement.srcObject = this.camService['stream'];
    await this.videoElement.nativeElement.play();
    this.camService.updateCanvas(this.canvasElement.nativeElement);
  }

  async toggleCamera() {
    if (this.camService.cameraStatus) {
      this.camService.stopCamera();
    } else {
      await this.camService.startCamera(
        this.videoElement.nativeElement,
        this.canvasElement.nativeElement
      );
    }
  }

  ngOnDestroy() {
    // Mantém a câmera ativa intencionalmente
  }
}
