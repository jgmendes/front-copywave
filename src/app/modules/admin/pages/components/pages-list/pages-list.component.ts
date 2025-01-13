import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import {
  OnInit,
  Component,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';

import { PagesService } from '../../pages.service';
import { UserService } from '../../../../../core/user/user.service';
import { PagePaginatedInterface } from '../../pages.types';
import {
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';

@Component({
  selector: 'pages-list',
  templateUrl: './pages-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ApplicationsListComponent implements OnInit {
  public sort: HubsdTableSortInterface;
  public paginator: HubsdTablePaginatorInterface;
  public data: PagePaginatedInterface = null;
  public selection = new SelectionModel<number>(true, []);
  public actionListener: EventEmitter<any> = new EventEmitter();
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly service: PagesService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.userService.user$.subscribe(() => {
      this.service
        .findAllPaginated(this.sort, this.paginator)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((res: { data: { pages: PagePaginatedInterface } }) => {
          this.data = res.data?.pages;
        });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  openPage(type: string, mode: string, id?: number): void {
    this.router.navigateByUrl(`paginas/${type}/${mode}${id ? '/' + id : ''}`);
  }
}
