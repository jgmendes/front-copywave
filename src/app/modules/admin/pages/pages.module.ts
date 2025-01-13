import { NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { pageRoutes } from './pages.routing';
import { SharedModule } from '../../../shared/shared.module';
import { HubsdHeaderModule } from '@hubsd/components/header/header.module';
import { ViewPageComponent } from './components/pages-view/pages-view.component';
import { HubsdPieChartModule } from '@hubsd/components/pie-chart/pie-chart.module';
import { HubsdBarChartModule } from '@hubsd/components/bar-chart/bar-chart.module';
import { PagesSimpleComponent } from './components/pages-simple/pages-simple.component';
import { PagesManualComponent } from './components/pages-manual/pages-manual.component';
import { ApplicationsListComponent } from './components/pages-list/pages-list.component';

@NgModule({
  declarations: [
    ViewPageComponent,
    PagesManualComponent,
    PagesSimpleComponent,
    ApplicationsListComponent,
  ],
  imports: [
    NgIf,
    FormsModule,
    SharedModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    HttpClientModule,
    HubsdHeaderModule,
    MatFormFieldModule,
    HubsdPieChartModule,
    HubsdBarChartModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(pageRoutes),
  ],
})
export class PagesModule {}
