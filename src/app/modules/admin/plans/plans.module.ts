import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { plansRoutes } from './plans.routing';
import { PlansComponent } from './plans.component';
import { PlansViewComponent } from './components/plans-view/plans-view.component';
import { PlansPaymentComponent } from './components/plans-payment/plans-payment.component';
import { PaymentService } from '../payments/payments.service';

@NgModule({
  providers: [PaymentService],
  declarations: [PlansComponent, PlansViewComponent, PlansPaymentComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    RouterModule.forChild(plansRoutes),
  ],
})
export class PlansModule {}
