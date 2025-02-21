import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {Emitters} from '../../emitters/emitters';

@Component({
  selector: 'app-barraLateral',
  templateUrl: './barraLateral.component.html',
  styleUrl: './barraLateral.component.css'
})

export class BarraLateralComponent implements OnInit {
  autenticado = false;
  abrirSubMenu: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    Emitters.authEmitter.subscribe(
      (auth:boolean) => {
        this.autenticado = auth;
      }
    )
  }

  //toggleSubMenu verifica se a aba "Relatório" está aberto ou não, se não estiver, ele aciona a abertura via Event Binding (click no HTML).
  //Foi implementado pra fazer a abertura do submenu da aba "Relatório"
  toggleSubMenu(subMenuName: string) {
    if (this.abrirSubMenu === subMenuName) {
      this.abrirSubMenu = null;
    } else {
      this.abrirSubMenu = subMenuName;
    }
  }

  logout(): void {
    this.authService.logout().subscribe(
      () => this.autenticado = false);
  }

}
