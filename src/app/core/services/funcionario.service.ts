import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private apiUrlFuncionario = 'http://127.0.0.1:8000/api/funcionarios/';

  constructor(private http: HttpClient) {}

  getFuncionarios(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrlFuncionario);
  }

  getIdFuncionario(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrlFuncionario}${id}/`);
  }

  adicionarFuncionario(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrlFuncionario, employee);
  }

  deletarFuncionario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlFuncionario}${id}/`);
  }

  // Corrigindo o erro na interpolação de string e no corpo da requisição
  updateTotalAlertas(id: number, totalAlertas: number) {
    return this.http.patch(`${this.apiUrlFuncionario}${id}/`,
      { total_alertas: totalAlertas }
    );
  }

  updateTempo(id: number, tempo: number) {
    return this.http.patch(`${this.apiUrlFuncionario}${id}/`,
      { duracao_segundos: tempo }
    );
  }
}
