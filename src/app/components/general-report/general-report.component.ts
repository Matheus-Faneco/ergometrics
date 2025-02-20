import {Component, OnInit} from '@angular/core';
import {RelatorioGeralService} from '../../core/services/relatorio-geral.service';
import {RelatorioGeral} from '../../core/models/relatorio-geral';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrl: './general-report.component.css'
})
export class GeneralReportComponent implements OnInit{
  relatorioGeral: RelatorioGeral = new RelatorioGeral();

  constructor(private relatorioGeralService: RelatorioGeralService) { }


  ngOnInit() {
    this.getRelatorioGeral()
  }

  getRelatorioGeral(){
    this.relatorioGeralService.getRelatorioGeral().subscribe({
      next: (data) => {
        this.relatorioGeral = data[0];
      }
    })
  }
}
