import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-Monitoramento',
  templateUrl: './monitoramento.component.html',
  styleUrls: ['./monitoramento.component.css']
})
export class MonitoramentoComponent {
  redirect(){
    window.open("/cameras")
  }

}
