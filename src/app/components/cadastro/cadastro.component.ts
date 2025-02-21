import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {FuncionarioService} from '../../core/services/funcionario.service';
import {Employee} from '../../core/models/employee';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent implements OnInit, AfterViewInit {
  colunasExibidas: string[] = ['nome', 'matricula', 'cargo', 'actions'];
  dataSource = new MatTableDataSource<Employee>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private funcionarioService: FuncionarioService,
  ) { }

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Associa o paginador ao dataSource
  }

  private carregarFuncionarios(): void {
    this.funcionarioService.getFuncionarios().subscribe({
      next: (funcionarios) => {
        this.dataSource.data = funcionarios; // Atualiza os dados da tabela
      },
      error: (error) => {
        console.error('Erro ao carregar funcionários:', error);
      }
    });
  }

  deleteEmployee(id: number): void {
    this.funcionarioService.deletarFuncionario(id).subscribe({
      next: () => {
        this.carregarFuncionarios(); // Recarrega a lista após deletar
      },
      error: (error) => {
        console.error('Erro ao deletar funcionário:', error);
      }
    });
  }
}


