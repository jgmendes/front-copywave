import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HubsdToastService } from '@hubsd/services/toast';

@Component({
  selector: 'app-plans-success',
  templateUrl: './plans-success.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PlansSuccessComponent implements OnInit {
  public plan: string;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: HubsdToastService
  ) {}

  ngOnInit(): void {
    this.toastService.handleMessage(
      { message: 'Pagamento aprovado com sucesso!' },
      null,
      { handleRequest: true }
    );

    this.activatedRoute.queryParams.subscribe((params) => {
      this.plan = params['plan'];
    });
  }

  goToPages(): void {
    this.router.navigate(['paginas']);
  }
}
