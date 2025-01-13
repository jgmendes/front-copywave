import { Route } from '@angular/router';
import { PlansComponent } from './plans.component';
import { PlansPaymentComponent } from './components/plans-payment/plans-payment.component';
import { PlansViewComponent } from './components/plans-view/plans-view.component';

export const plansRoutes: Route[] = [
  {
    path: '',
    component: PlansComponent,
  },
  {
    path: 'pagamento',
    component: PlansPaymentComponent,
  },
  {
    path: 'pagamento/:id',
    component: PlansViewComponent,
  },
];
