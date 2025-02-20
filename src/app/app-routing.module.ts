import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {MonitorComponent} from './components/monitor/monitor.component';
import {IndividualReportComponent} from './components/individual-report/individual-report.component';
import {GeneralReportComponent} from './components/general-report/general-report.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {UserManualComponent} from './components/user-manual/user-manual.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {EmployeeAddComponent} from './components/employee-add/employee-add.component';
import {CamerasComponent} from './components/cameras/cameras.component';
import {SearchEmployeeComponent} from './components/search-employee/search-employee.component';
import {HomeComponent} from './components/home/home.component';

const routes: Routes = [
  { path: 'home', component: SidebarComponent, children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'acompanhamento',
        component: MonitorComponent
      },
      {
        path: 'lista-funcionarios',
        component: SearchEmployeeComponent
      },
      {
        path: 'relatorio-individual/:id',
        component: IndividualReportComponent
      },
      {
        path: 'relatorio-geral',
        component: GeneralReportComponent
      },
      {
        path: 'cadastro',
        component: RegistrationComponent
      },
      {
        path: 'adicionar-funcionario',
        component: EmployeeAddComponent
      },
      {
        path: 'manual',
        component: UserManualComponent
      },
    ] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'cameras', component: CamerasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
