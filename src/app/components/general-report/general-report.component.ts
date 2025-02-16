import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrl: './general-report.component.css'
})
export class GeneralReportComponent implements OnInit{
  totalAlertsGeneral: number = 0;
  averageTime: number = 0;


  ngOnInit() {
    this.getTotalAlertsGeneral()
    this.getAverageTime()
  }

  getTotalAlertsGeneral (): number {
    return this.totalAlertsGeneral;
  }

  getAverageTime(): number{
    return this.averageTime;
  }

  openSubMenu: string | null = null;


  toggleSubMenu(subMenuName: string) {
    if (this.openSubMenu === subMenuName) {
      this.openSubMenu = null;
    } else {
      this.openSubMenu = subMenuName;
    }
  }

}
