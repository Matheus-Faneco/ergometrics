import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {MonitoramentoComponent} from './components/Monitoramento/monitoramento.component';
import {RelatorioIndividualComponent} from './components/relatorioIndividual/relatorioIndividual.component';
import {RelatorioGeralComponent} from './components/relatorioGeral/relatorioGeral.component';
import {CadastroComponent} from './components/cadastro/cadastro.component';
import {ManualDoUsuarioComponent} from './components/manualDoUsuario/manualDoUsuario.component';
import {BarraLateralComponent} from './components/barraLateral/barraLateral.component';
import {AdicionarFuncionarioComponent} from './components/adicionarFuncionario/adicionarFuncionario.component';
import {CamerasComponent} from './components/cameras/cameras.component';
import {PesquisarFuncionarioComponent} from './components/pesquisarFuncionario/pesquisarFuncionario.component';
import {HomeComponent} from './components/home/home.component';

const routes: Routes = [
  { path: 'home', component: BarraLateralComponent, children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'acompanhamento',
        component: MonitoramentoComponent
      },
      {
        path: 'lista-funcionarios',
        component: PesquisarFuncionarioComponent
      },
      {
        path: 'relatorio-individual/:id',
        component: RelatorioIndividualComponent
      },
      {
        path: 'relatorio-geral',
        component: RelatorioGeralComponent
      },
      {
        path: 'cadastro',
        component: CadastroComponent
      },
      {
        path: 'adicionar-funcionario',
        component: AdicionarFuncionarioComponent
      },
      {
        path: 'manual',
        component: ManualDoUsuarioComponent
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
