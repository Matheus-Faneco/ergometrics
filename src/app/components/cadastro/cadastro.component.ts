import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {FuncionarioService} from '../../core/services/funcionario.service';
import {Employee} from '../../core/models/employee';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent implements OnInit {
  colunasExibidas: string[] = ['name', 'cadastro', 'position', 'actions'];
  dataSource = new MatTableDataSource<Employee>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: FuncionarioService,
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private loadEmployees(): void {
    this.employeeService.getFuncionarios().subscribe(employees => {
      this.dataSource.data = employees;
    });
  }

  deleteEmployee(id: number): void {
    this.employeeService.deletarFucionario(id).subscribe(() => {
      this.loadEmployees();
    });
  }

}


