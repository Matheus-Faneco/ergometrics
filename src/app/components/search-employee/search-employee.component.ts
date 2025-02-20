import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../core/services/employee.service';
import {Employee} from '../../core/models/employee';

@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrl: './search-employee.component.css'
})
export class SearchEmployeeComponent implements OnInit {
  filteredEmployeeList: Employee[] = [];
  allEmployees: Employee[] = [];
  searchText: string = ""

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(
      (employees: Employee[]) => {
        this.allEmployees = employees;
        this.filteredEmployeeList = employees;
      }
    )
  }
  filterEmployee(){
    if (!this.searchText){
      this.filteredEmployeeList = this.allEmployees;
      return;
    }
    this.filteredEmployeeList = this.allEmployees.filter(
      employee => employee.nome.toLowerCase().includes(this.searchText.toLowerCase())
    )
  }


}
