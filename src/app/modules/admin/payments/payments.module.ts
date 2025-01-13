import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { paymentsRoutes } from './payments.routing';
import { PaymentService } from './payments.service';
import { PaymentsComponent } from './payments.component';
import { HubsdHeaderModule } from '@hubsd/components/header';

@NgModule({
  providers: [PaymentService],
  declarations: [PaymentsComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    HubsdHeaderModule,
    RouterModule.forChild(paymentsRoutes),
  ],
})
export class PaymentsModule {}
