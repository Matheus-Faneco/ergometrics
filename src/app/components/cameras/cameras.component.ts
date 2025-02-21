import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  constructor(private http: HttpClient) {
  }

  //matricula do funcionario para atribuiçao
  matriculaFuncionario: string = ""

  // camera e modelo do tensorflow
  detector?: poseDetection.PoseDetector;
  isDetecting = false;
  statusMessage = 'Inicializando...';
  private isFrontCamera = false;

  // Variáveis para controlar o tempo em que o ângulo está incorreto
  private startIncorrectTime: number | null = null;
  public incorrectDuration: number = 0;

  atribuirFuncionario() {
    if (!this.matriculaFuncionario) {
      alert('Digite a matrícula do funcionário!');
      return;
    }

    // Faz a requisição POST
    this.http.post(
      'http://localhost:8000/api/camera/atribuir-funcionario/',
      { matricula: this.matriculaFuncionario },
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: () => {
        alert('Funcionário atribuído com sucesso!');
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao atribuir funcionário!');
      }
    });
  }



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
    // Defina os pontos de interesse
    const keypointsOfInterest = [
      'left_shoulder', 'right_shoulder',
      'left_elbow', 'right_elbow',
      'left_wrist', 'right_wrist'
    ];

    for (const pose of poses) {
      for (const keypoint of pose.keypoints) {
        const score = keypoint.score ?? 0;
        const keypointName = keypoint.name ?? ''; // Fornece um valor padrão vazio se name for undefined

        if (score > 0.3 && keypointsOfInterest.includes(keypointName)) {
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
    const tolerance = 5; // Tolerância de ±10 graus

    // Processa o lado direito
    this.checkElbowAngle(
      pose,
      'right_shoulder',
      'right_elbow',
      'right_wrist',
      tolerance,
      'direito'
    );

    // Processa o lado esquerdo
    this.checkElbowAngle(
      pose,
      'left_shoulder',
      'left_elbow',
      'left_wrist',
      tolerance,
      'esquerdo'
    );
  }

  private checkElbowAngle(
    pose: poseDetection.Pose,
    shoulderName: string,
    elbowName: string,
    wristName: string,
    tolerance: number,
    side: string
  ): void {
    const shoulder = pose.keypoints.find(kp => kp.name === shoulderName);
    const elbow = pose.keypoints.find(kp => kp.name === elbowName);
    const wrist = pose.keypoints.find(kp => kp.name === wristName);

    if (shoulder && elbow && wrist) {
      const angle = this.calculateAngle(
        shoulder.x, shoulder.y,
        elbow.x, elbow.y,
        wrist.x, wrist.y
      );


      const isAngleIncorrect = angle < 70 || angle > 100;

      if (isAngleIncorrect) {
        if (this.startIncorrectTime === null) {
          this.startIncorrectTime = Date.now();
        } else {
          const duration = Date.now() - this.startIncorrectTime;
          if (duration >= 5000) { // Se o ângulo estiver incorreto por mais de 1 segundo
            this.incorrectDuration = duration;
            console.log(`Ângulo incorreto por: ${this.incorrectDuration} ms no lado ${side} (Ângulo: ${angle.toFixed(2)}°)`);
            this.handleIncorrectDuration(this.incorrectDuration, angle, side);
            this.startIncorrectTime = null; // Reinicia o contador após registrar
          }
        }
      } else {
        // Se o ângulo estiver correto, reinicia o contador
        this.startIncorrectTime = null;
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
  private handleIncorrectDuration(duration: number, angle: number, side: string): void {
    // Exemplo de log; substitua por qualquer ação necessária
    console.log(`O ângulo no lado ${side} ficou incorreto por ${duration} ms (Ângulo: ${angle.toFixed(2)}°)`);
  }


  //----------------FUNÇÃO DE TROCAR CAMERA------------------------
  //---------------------------------------------------------------
  // async switchCamera() {
  //   this.isDetecting = false;
  //   this.isFrontCamera = !this.isFrontCamera;
  //
  //   if (this.videoElement?.nativeElement.srcObject) {
  //     const stream = this.videoElement.nativeElement.srcObject as MediaStream;
  //     stream.getTracks().forEach(track => track.stop());
  //   }
  //
  //   try {
  //     await this.startCamera();
  //     this.startDetection();
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }
  //---------------------------------------------------------------
  //---------------------------------------------------------------


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
