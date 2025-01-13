import { ActivatedRoute, Router } from '@angular/router';
import { HubsdToastService } from '@hubsd/services/toast';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { PaymentService } from '../../../payments/payments.service';

@Component({
  selector: 'app-plans-view',
  templateUrl: './plans-view.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PlansViewComponent implements OnInit {
  public payment: {
    id: number;
    plan: string;
    status: string;
    paymentId: string;
  } = null;
  constructor(
    private readonly router: Router,
    private readonly paymentService: PaymentService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastService: HubsdToastService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.paymentService
        .findOne(parseInt(params.get('id')))
        .subscribe((response) => {
          this.payment = response;
          this.toastService.handleMessage(
            response.status === 'success'
              ? { message: 'Pagamento autorizado com sucesso!' }
              : response.status === 'rejected'
              ? { error: { message: 'Pagamento não foi autorizado!' } }
              : {
                  message: 'Pagamento em processamento, aguarde a confirmação.',
                },
            null,
            { handleRequest: true }
          );
        });
    });
  }

  goToRoute(route: string): void {
    this.router.navigate([route]);
  }
}
