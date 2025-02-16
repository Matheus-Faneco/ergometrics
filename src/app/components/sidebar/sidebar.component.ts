import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent {
  openSubMenu: string | null = null;

  //toggleSubMenu verifica se a aba "Relatório" está aberto ou não, se não estiver, ele aciona a abertura via Event Binding (click no HTML).
  //Foi implementado pra fazer a abertura do submenu da aba "Relatório"
  toggleSubMenu(subMenuName: string) {
    if (this.openSubMenu === subMenuName) {
      this.openSubMenu = null;
    } else {
      this.openSubMenu = subMenuName;
    }
  }
}
