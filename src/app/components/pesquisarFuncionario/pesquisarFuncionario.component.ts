import {Component, OnInit} from '@angular/core';
import {FuncionarioService} from '../../core/services/funcionario.service';
import {Employee} from '../../core/models/employee';

@Component({
  selector: 'app-pesquisarFuncionario',
  templateUrl: './pesquisarFuncionario.component.html',
  styleUrl: './pesquisarFuncionario.component.css'
})
export class PesquisarFuncionarioComponent implements OnInit {
  listaDeFuncionarioFiltrada: Employee[] = [];
  todosOsFuncionarios: Employee[] = [];
  pesquisar: string = ""

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit() {
    this.funcionarioService.getFuncionarios().subscribe(
      (employees: Employee[]) => {
        this.todosOsFuncionarios = employees;
        this.listaDeFuncionarioFiltrada = employees;
      }
    )
  }
  filterFuncionario(){
    if (!this.pesquisar){
      this.listaDeFuncionarioFiltrada = this.todosOsFuncionarios;
      return;
    }
    this.listaDeFuncionarioFiltrada = this.todosOsFuncionarios.filter(
      employee => employee.nome.toLowerCase().includes(this.pesquisar.toLowerCase())
    )
  }


}
