import { Component, OnInit, OnDestroy } from '@angular/core';
import { FuncionarioService } from '../../core/services/funcionario.service';
import { Employee } from '../../core/models/employee';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-relatorioIndividual',
  templateUrl: './relatorioIndividual.component.html',
  styleUrls: ['./relatorioIndividual.component.css']
})
export class RelatorioIndividualComponent implements OnInit, OnDestroy {
  funcionario: Employee = new Employee();
  idFuncionario: number | undefined;
  updateSubscription: Subscription | undefined;

  constructor(
    private rota: ActivatedRoute,
    private funcionarioService: FuncionarioService
  ) { }

  ngOnInit() {
    this.getFuncionarioPeloId();

    // Atualiza os dados do funcionário a cada 5 segundos para refletir as mudanças em tempo real.
    this.updateSubscription = interval(5000).subscribe(() => {
      if (this.idFuncionario) {
        this.buscarFuncionario(this.idFuncionario);
      }
    });
  }

  getFuncionarioPeloId(){
    const idFuncionario = this.rota.snapshot.paramMap.get('id');
    if (idFuncionario){
      this.idFuncionario = +idFuncionario; // Converte para número
    }
    this.buscarFuncionario(this.idFuncionario!);
  }

  buscarFuncionario(id: number){
    this.funcionarioService.getIdFuncionario(id).subscribe(
      (employee: Employee) => {
        this.funcionario = employee;
      }
    );
  }

  ngOnDestroy() {
    // Cancela o polling quando o componente for destruído.
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}
