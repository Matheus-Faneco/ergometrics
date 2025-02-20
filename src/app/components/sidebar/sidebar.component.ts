import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {Emitters} from '../../emitters/emitters';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements OnInit {
  authenticated = false;
  openSubMenu: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    Emitters.authEmitter.subscribe(
      (auth:boolean) => {
        this.authenticated = auth;
      }
    )
  }

  //toggleSubMenu verifica se a aba "Relatório" está aberto ou não, se não estiver, ele aciona a abertura via Event Binding (click no HTML).
  //Foi implementado pra fazer a abertura do submenu da aba "Relatório"
  toggleSubMenu(subMenuName: string) {
    if (this.openSubMenu === subMenuName) {
      this.openSubMenu = null;
    } else {
      this.openSubMenu = subMenuName;
    }
  }

  logout(): void {
    this.authService.logout().subscribe(
      () => this.authenticated = false);
  }

}
