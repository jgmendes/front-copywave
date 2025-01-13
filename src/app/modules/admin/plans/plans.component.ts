import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';
import { HubsdToastService } from '@hubsd/services/toast';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PlansComponent {
  constructor(
    private readonly router: Router,
    private matDialog: MatDialog,
    private readonly cdr: ChangeDetectorRef,
    private readonly toastService: HubsdToastService
  ) {}
  step: boolean = true;

  showStep(type: string) {
    if (type === 'year') {
      this.step = false;
    } else {
      this.step = true;
    }
  }

  selectPlan(plan: string) {
    this.router.navigate(['planos/pagamento'], {
      queryParams: { plan, month: this.step },
    });
  }
}
