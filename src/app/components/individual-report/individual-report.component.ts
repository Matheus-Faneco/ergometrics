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
  employees: Employee[] = [];


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


  getAlertNumber(): number {
    return this.alertNumber;
  }

  getTotalTimeBadPosture(): number {
    return this.totalTimeBadPosture;
  }

  loadHistoryData() {
  }
}
