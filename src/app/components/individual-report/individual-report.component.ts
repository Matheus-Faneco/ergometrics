import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../core/services/employee.service';
import {Employee} from '../../core/models/employee';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-individual-report',
  templateUrl: './individual-report.component.html',
  styleUrl: './individual-report.component.css'
})
export class IndividualReportComponent implements OnInit {

  constructor(private employeeService: EmployeeService) { }

  alertNumber: number = 0;
  totalTimeBadPosture: number = 0;
  historyData: Array<{ date: string; duration: number }> = [];
  selectedUser: any;
  employees: Employee[] = [];
  filteredEmployee: Employee[] = [];

  filterUsers(event: any) {
    const query = event.query.toLowerCase();
    this.filteredEmployee = this.employees.filter(employee =>
      employee.nome.toLowerCase().includes(query)
    );
  }

  ngOnInit() {
    this.getAlertNumber()
    this.getTotalTimeBadPosture()
    this.loadHistoryData()
    this.getEmployees()
  }

  getEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
        this.employees = [...employees];
      }
    })
  }

  getEmployeeByName(name: string){
    if (this.selectedUser === Employee.name){}

  }


  getAlertNumber(): number {
    return this.alertNumber;
  }

  getTotalTimeBadPosture(): number {
    return this.totalTimeBadPosture;
  }

  loadHistoryData() {
  }
}
