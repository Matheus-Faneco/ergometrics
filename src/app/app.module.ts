import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { IndividualReportComponent } from './components/individual-report/individual-report.component';
import { GeneralReportComponent } from './components/general-report/general-report.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserManualComponent } from './components/user-manual/user-manual.component';
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
import { EmployeeAddComponent } from './components/employee-add/employee-add.component';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {CardModule} from 'primeng/card';
import {WebcamModule} from 'ngx-webcam';
import { CamerasComponent } from './components/cameras/cameras.component';
import { SearchEmployeeComponent } from './components/search-employee/search-employee.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    MonitorComponent,
    IndividualReportComponent,
    GeneralReportComponent,
    RegistrationComponent,
    UserManualComponent,
    ChartComponent,
    EmployeeAddComponent,
    CamerasComponent,
    SearchEmployeeComponent
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
