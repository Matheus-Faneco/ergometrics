import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {RelatorioGeral} from '../models/relatorio-geral';

@Injectable({
  providedIn: 'root'
})
export class RelatorioGeralService {

  private apiUrlRelatorioGeral = 'http://localhost:8000/api/relatorio-geral/';

  constructor(private http: HttpClient) { }

  getRelatorioGeral(): Observable<RelatorioGeral[]> {
    return this.http.get<RelatorioGeral[]>(this.apiUrlRelatorioGeral);
  }


}
