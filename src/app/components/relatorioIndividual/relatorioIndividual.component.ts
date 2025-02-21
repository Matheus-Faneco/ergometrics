import {Component, OnInit} from '@angular/core';
import {FuncionarioService} from '../../core/services/funcionario.service';
import {Employee} from '../../core/models/employee';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-relatorioIndividual',
  templateUrl: './relatorioIndividual.component.html',
  styleUrl: './relatorioIndividual.component.css'
})
export class RelatorioIndividualComponent implements OnInit {
  funcionario: Employee = new Employee();
  idFuncionario: number | undefined;

  constructor(
    private rota: ActivatedRoute,
    private funcionarioService: FuncionarioService
  ) { }

  ngOnInit() {
    this.getFuncionarioPeloId()
  }

  getFuncionarioPeloId(){
    const idFuncionario = this.rota.snapshot.paramMap.get('id');
    if (idFuncionario){
      this.idFuncionario = +idFuncionario; // convertendo o id na url em numero
    }
    this.buscarFuncionario(this.idFuncionario!);
  }
  buscarFuncionario(id: number){
    this.funcionarioService.getIdFuncionario(id).subscribe(
      (employee: Employee) => {
        this.funcionario = employee;
      }
    )
  }

}
