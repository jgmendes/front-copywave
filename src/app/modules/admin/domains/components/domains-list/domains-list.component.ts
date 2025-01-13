import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  HubsdTableInterface,
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, takeUntil } from 'rxjs';
import { HubsdConfirmationService } from '@hubsd/services/confirmation';
import { DomainsService } from '../../domains.service';
import { HubsdToastService } from '@hubsd/services/toast';
import { Router } from '@angular/router';
import { HubsdHeaderActionInterface } from '@hubsd/components/header';
import {
  DomainsFilterInterface,
  DomainsPaginatedInterface,
} from '../../domains.types';

@Component({
  selector: 'app-domains-list',
  templateUrl: './domains-list.component.html',
})
export class DomainsListComponent implements OnInit, OnDestroy {
  public data: DomainsPaginatedInterface = null;
  public config: HubsdTableInterface = {
    title: 'Domínios',
    headers: [
      { name: 'URL', key: 'url' },
      { name: 'Status', key: 'status' },
      { name: 'Tipo', key: 'type' },
    ],
    content: [
      { type: 'field', key: 'url' },
      { type: 'field', key: 'status' },
      { type: 'field', key: 'type' },
    ],
    actions: true,
    searchable: true,
    searchableConfig: {
      requestPagination: true,
    },
    selection: true,
    paginator: true,
    paginatorConfig: {
      requestPagination: true,
    },
    sortable: true,
    sortConfig: {
      requestPagination: true,
    },
  };

  public sort: HubsdTableSortInterface;
  public paginator: HubsdTablePaginatorInterface;
  public selection = new SelectionModel<number>(true, []);
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly router: Router,
    private readonly service: DomainsService,
    private readonly toastService: HubsdToastService,
    private readonly confirmationService: HubsdConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(filters?: DomainsFilterInterface): void {
    this.service
      .findAllPaginated(this.sort, this.paginator, filters)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: { data: { domains: DomainsPaginatedInterface } }) => {
        this.data = res.data.domains;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  handleSort(event: HubsdTableSortInterface): void {
    this.sort = event;
    this.getAll();
  }

  handlePaginator(event: HubsdTablePaginatorInterface): void {
    this.paginator = event;
    this.getAll();
  }

  handleAction(data: HubsdHeaderActionInterface): void {
    switch (data.action) {
      case 'form':
        if (!data.id) {
          this.router.navigateByUrl('dominios/criar');
        } else {
          this.router.navigateByUrl(`dominios/editar/${data.id}`);
        }
        break;
      case 'delete':
        const dialogRef = this.confirmationService.open();

        dialogRef.afterClosed().subscribe((res) => {
          if (res === 'confirmed') {
            this.service.delete(data.id).subscribe({
              next: (res) => {
                this.getAll();
                this.toastService.handleMessage(res, null, {
                  handleRequest: true,
                });
              },
              error: (error) => {
                this.toastService.handleMessage(
                  error,
                  'Não foi possível remover o domínio.',
                  { handleRequest: true }
                );
              },
            });
          }
        });
        break;
    }
  }
}
