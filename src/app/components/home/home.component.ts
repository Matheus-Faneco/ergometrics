import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Emitters} from '../../emitters/emitters';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  mensagem = '';

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.http.get('http://127.0.0.1:8000/api/usuario/', {withCredentials: true}).subscribe(
      (res: any) => {
        this.mensagem = `Olá ${res['usuario']}`;
        Emitters.authEmitter.emit(true);
      },
      (err) => {
        this.mensagem = 'Vc nao esta logado';
        Emitters.authEmitter.emit(false);
      })
  }
}
