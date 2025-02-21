import {Component, OnInit} from '@angular/core';
import {RelatorioGeralService} from '../../core/services/relatorio-geral.service';
import {RelatorioGeral} from '../../core/models/relatorio-geral';

@Component({
  selector: 'app-relatorioGeral',
  templateUrl: './relatorioGeral.component.html',
  styleUrl: './relatorioGeral.component.css'
})
export class RelatorioGeralComponent implements OnInit{
  relatorioGeral: RelatorioGeral = new RelatorioGeral();

  constructor(private relatorioGeralService: RelatorioGeralService) { }

  ngOnInit() {
    this.getRelatorioGeral()
  }

  getRelatorioGeral(){
    this.relatorioGeralService.getRelatorioGeral().subscribe({
      next: (data) => {
        this.relatorioGeral = data[0]; //sempre irá pegar o relatorio_geral com id = 1
      }
    })
  }
}
