import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Employee} from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrlEmployee = 'http://127.0.0.1:8000/api/funcionarios/';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrlEmployee);
  }
  getEmployeeId(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrlEmployee}${id}/`);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrlEmployee, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlEmployee}${id}/`);
  }
}
