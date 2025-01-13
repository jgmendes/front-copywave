import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { domainsRoutes } from './domains.routing';
import { DomainsFormComponent } from './components/domains-form/domains-form.component';
import { DomainsListComponent } from './components/domains-list/domains-list.component';

import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from '../../../shared/shared.module';
import { HubsdHeaderModule } from '@hubsd/components/header';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  declarations: [DomainsFormComponent, DomainsListComponent],
  imports: [
    CommonModule,
    NgIf,
    SharedModule,
    MatIconModule,
    MatInputModule,
    TextFieldModule,
    MatButtonModule,
    MatDialogModule,
    HubsdHeaderModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,

    MatDialogModule,
    RouterModule.forChild(domainsRoutes),
  ],
})
export class DomainsModule {}
