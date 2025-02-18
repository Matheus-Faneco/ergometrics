import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../core/services/employee.service';
import {Employee} from '../../core/models/employee';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-individual-report',
  templateUrl: './individual-report.component.html',
  styleUrl: './individual-report.component.css'
})
export class IndividualReportComponent implements OnInit {
  employee: Employee = new Employee();
  employeeId: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.getFuncionarioPeloId()
  }

  getFuncionarioPeloId(){
    const idFuncionario = this.route.snapshot.paramMap.get('id');
    if (idFuncionario){
      this.employeeId = +idFuncionario; // convertendo o id na url em numero
    }
    this.buscarFuncionario(this.employeeId!);
  }
  buscarFuncionario(id: number){
    this.employeeService.getEmployeeId(id).subscribe(
      (employee: Employee) => {
        this.employee = employee;
      }
    )
  }

}
