import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FuncionarioService} from '../../core/services/funcionario.service';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  constructor(private http: HttpClient, private funcionarioService: FuncionarioService) {
  }

  //matricula do funcionario para atribuiçao
  matriculaFuncionario: string = "";

  // camera e modelo do tensorflow
  detector?: poseDetection.PoseDetector;
  estaDetectando = false;
  mensagemDeStatus = 'Inicializando...';
  private cameraFrontal = false;


  // Variável para contar os alertas
  private alertaCount: number = 0;

  // Variáveis para controlar o tempo em que o ângulo está incorreto
  private iniciarTempoIncorreto: number | null = null;
  public duracaoIncorreta: number = 0;

  // Faz a atribuição de Funcionario
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
      await this.iniciarCamera();
      await this.loadModel();
      this.iniciarDeteccao();
    } catch (error) {
      this.erroAoIdentificar(error);
    }
  }

  // Faz o carregamento do Movenet para detectar as Pose
  private async loadModel() {
    this.mensagemDeStatus = 'Carregando modelo...';
    this.detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true
      }
    );
    this.mensagemDeStatus = '';
  }

  // Inicia a camera
  private async iniciarCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: this.cameraFrontal ? 'user' : 'environment'
        }
      });

      const video = this.videoElement.nativeElement;
      video.srcObject = stream;

      // Espera o carregamento de metadatas do video
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.width = video.videoWidth;
          video.height = video.videoHeight;
          this.atualizarCanvas();
          resolve();
        };
        video.onerror = reject;
      });

      await video.play();
    } catch (error) {
      throw new Error(`Erro na câmera: ${this.getMensagemDeErro(error)}`);
    }
  }

  // Faz a atualização do Canvas com base no Video
  private atualizarCanvas() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }

  // Inicia a detecção de poses com a camera
  private async iniciarDeteccao() {
    if (!this.detector) return;

    this.estaDetectando = true;
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    while (this.estaDetectando) {
      if (video.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
        ctx.save();

        if (this.cameraFrontal) {
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
        }

        // Estima a pose a partir do vídeo
        const poses = await this.detector.estimatePoses(video);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.desenharPontos(poses, ctx);

        // Se houver alguma pose detectada, processa o ângulo do ombro
        if (poses.length > 0) {
          const pose = poses[0];
          this.processarAngulo(pose);
        }

        ctx.restore();
      }
      await tf.nextFrame();
    }
  }

  // Desenha os pontos a serem capturados
  private desenharPontos(poses: poseDetection.Pose[], ctx: CanvasRenderingContext2D) {

    const pontos = [
      'left_shoulder', 'right_shoulder',
      'left_elbow', 'right_elbow',
      'left_wrist', 'right_wrist'
    ];

    for (const pose of poses) {
      for (const keypoint of pose.keypoints) {
        const score = keypoint.score ?? 0;
        const keypointName = keypoint.name ?? '';

        if (score > 0.3 && pontos.includes(keypointName)) {
          ctx.beginPath();
          // Ajusta coordenadas para câmera frontal
          const x = this.cameraFrontal ? ctx.canvas.width - keypoint.x : keypoint.x;
          ctx.arc(x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#FF0000';
          ctx.fill();
        }
      }
    }
  }

  // Processa a pose para calcular o ângulo do ombro e verificar se está correto.
  // Usa os pontos: ombro, cotovelo e quadril.
  private processarAngulo(pose: poseDetection.Pose): void {
    const tolerance = 5;

    this.verificarAngulo(
      pose,
      'right_shoulder',
      'right_elbow',
      'right_wrist',
      'direito'
    );

    this.verificarAngulo(
      pose,
      'left_shoulder',
      'left_elbow',
      'left_wrist',
      'esquerdo'
    );
  }

  // Faz a verificação dos angulos dos ombros
  private verificarAngulo(
    pose: poseDetection.Pose,
    nomeOmbro: string,
    nomeCotovelo: string,
    nomePunho: string,
    lado: string
  ): void {
    const ombro = pose.keypoints.find(kp => kp.name === nomeOmbro);
    const cotovelo = pose.keypoints.find(kp => kp.name === nomeCotovelo);
    const punho = pose.keypoints.find(kp => kp.name === nomePunho);

    if (ombro && cotovelo && punho) {
      const angle = this.calcularAngulo(
        ombro.x, ombro.y,
        cotovelo.x, cotovelo.y,
        punho.x, punho.y
      );

      const isAngleIncorrect = angle < 70 || angle > 100;

      if (isAngleIncorrect) {
        if (this.iniciarTempoIncorreto === null) {
          this.iniciarTempoIncorreto = Date.now();
        } else {
          const duration = Date.now() - this.iniciarTempoIncorreto;
          if (duration >= 5000) {
            this.duracaoIncorreta = duration;
            console.log(`Ângulo incorreto por: ${this.duracaoIncorreta} ms no lado ${lado} (Ângulo: ${angle.toFixed(2)}°)`);

            // Enviar o alerta e tempo
            if (this.funcionario) {
              this.incrementarAlerta(this.funcionario.id);  // Atualiza alertas
              this.incrementarTempo(this.funcionario.id);   // Atualiza tempo incorreto
            }

            this.iniciarTempoIncorreto = null;
          }
        }
      } else {
        this.iniciarTempoIncorreto = null;  // Reseta o tempo caso o ângulo esteja correto
      }
    }
  }
  // Calcula o ângulo formado pelos pontos A, B e C, onde B é o vértice.
  // Neste caso, A: cotovelo, B: ombro e C: quadril.
  private calcularAngulo(
    xA: number, yA: number,
    xB: number, yB: number,
    xC: number, yC: number
  ): number {
    const vetorBA = { x: xA - xB, y: yA - yB };
    const vetorBC = { x: xC - xB, y: yC - yB };


    const mutiplicação = vetorBA.x * vetorBC.x + vetorBA.y * vetorBC.y;
    const magBA = Math.sqrt(vetorBA.x ** 2 + vetorBA.y ** 2);
    const magBC = Math.sqrt(vetorBC.x ** 2 + vetorBC.y ** 2);

    if (magBA === 0 || magBC === 0) return 0;

    const anguloCos = mutiplicação / (magBA * magBC);
    const anguloRad = Math.acos(Math.max(-1, Math.min(1, anguloCos)));
    const anguloDeg = anguloRad * (180 / Math.PI);
    return anguloDeg;
  }


  private erroAoIdentificar(error: unknown) {
    this.mensagemDeStatus = `Erro: ${this.getMensagemDeErro(error)}`;
    console.error(error);
  }

  private getMensagemDeErro(error: unknown): string {
    return error instanceof Error ? error.message : 'Erro desconhecido';
  }


  funcionario: any = null; // Armazena os dados do funcionário pesquisado

// Busca funcionário pela matrícula antes de atribuir
  buscarFuncionario() {
    if (!this.matriculaFuncionario) {
      alert('Digite a matrícula do funcionário!');
      return;
    }

    this.http.get<any>(`http://localhost:8000/api/funcionario/${this.matriculaFuncionario}/`).subscribe({
      next: (data) => {
        this.funcionario = data; // Atualiza os dados do funcionário
      },
      error: (err) => {
        console.error(err);
        alert('Funcionário não encontrado!');
      }
    });
  }


  incrementarAlerta(id: number) {
    this.funcionarioService.getIdFuncionario(id).subscribe((funcionario) => {
      if (funcionario) {
        const novoTotal = funcionario.total_alertas + 1;

        this.funcionarioService.updateTotalAlertas(id, novoTotal).subscribe(() => {
          funcionario.total_alertas = novoTotal;
          console.log(`Total de alertas atualizado para o funcionário ${id}: ${novoTotal}`);
        });
      }
    });
  }

  incrementarTempo(id: number) {
    this.funcionarioService.getIdFuncionario(id).subscribe((funcionario) => {
      if (funcionario) {
        const novoTotal = funcionario.duracao_segundos + this.duracaoIncorreta;

        this.funcionarioService.updateTempo(id, novoTotal).subscribe(() => {
          funcionario.duracao_segundos = novoTotal;
          console.log(`Total de tempo atualizado para o funcionário ${id}: ${novoTotal}`);
        });
      }
    });
  }


  ngOnDestroy() {
    this.estaDetectando = false;
    if (this.videoElement?.nativeElement.srcObject) {
      const tracks = (this.videoElement.nativeElement.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  }

}
