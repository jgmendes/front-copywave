import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PaymentService } from './payments.service';
import { PaymentInterface } from './payments.types';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PaymentsComponent implements OnInit {
  public payments: PaymentInterface[] = [];
  constructor(private readonly paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.findAll().subscribe((response: PaymentInterface[]) => {
      this.payments = response;
    });
  }
}
