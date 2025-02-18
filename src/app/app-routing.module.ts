import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {MonitorComponent} from './components/monitor/monitor.component';
import {IndividualReportComponent} from './components/individual-report/individual-report.component';
import {GeneralReportComponent} from './components/general-report/general-report.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {UserManualComponent} from './components/user-manual/user-manual.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {UserPerfilComponent} from './components/user-perfil/user-perfil.component';
import {EmployeeAddComponent} from './components/employee-add/employee-add.component';
import {CamerasComponent} from './components/cameras/cameras.component';

const routes: Routes = [
  { path: 'home', component: SidebarComponent, children: [
      {
        path: 'acompanhamento',
        component: MonitorComponent
      },
      {
        path: 'relatorio-individual',
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
      {
        path: 'perfil',
        component: UserPerfilComponent
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
