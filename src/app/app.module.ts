import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { BarraLateralComponent } from './components/barraLateral/barraLateral.component';
import { MonitoramentoComponent } from './components/Monitoramento/monitoramento.component';
import { RelatorioIndividualComponent } from './components/relatorioIndividual/relatorioIndividual.component';
import { RelatorioGeralComponent } from './components/relatorioGeral/relatorioGeral.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { ManualDoUsuarioComponent } from './components/manualDoUsuario/manualDoUsuario.component';
import { ChartComponent } from './components/chart/chart.component';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { PasswordModule } from 'primeng/password';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { AdicionarFuncionarioComponent } from './components/adicionarFuncionario/adicionarFuncionario.component';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {CardModule} from 'primeng/card';
import {WebcamModule} from 'ngx-webcam';
import { CamerasComponent } from './components/cameras/cameras.component';
import { PesquisarFuncionarioComponent } from './components/pesquisarFuncionario/pesquisarFuncionario.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    BarraLateralComponent,
    MonitoramentoComponent,
    RelatorioIndividualComponent,
    RelatorioGeralComponent,
    CadastroComponent,
    ManualDoUsuarioComponent,
    ChartComponent,
    AdicionarFuncionarioComponent,
    CamerasComponent,
    PesquisarFuncionarioComponent
  ],
  imports: [
    // Angular
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    WebcamModule,

    // PrimeNG
    PasswordModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ChartModule,
    AutoCompleteModule,

    // Angular Material
    MatSidenavModule,
    MatButton,
    MatIconButton,
    MatCard,
    MatCardModule,
    MatCardHeader,
    MatCardContent,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatIcon,
    MatPaginator,
    MatFormField,
    MatInput,
    CardModule,
    MatFabButton
  ],
  providers: [
    provideAnimationsAsync('noop')
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
