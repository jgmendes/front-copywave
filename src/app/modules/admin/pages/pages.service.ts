import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';

import {
  HubsdTableSortInterface,
  HubsdTablePaginatorInterface,
} from '@hubsd/components/table';
import {
  PageInterface,
  PageFilterInterface,
  PagePaginatedInterface,
} from './pages.types';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  constructor(
    private readonly apollo: Apollo,
    private readonly httpClient: HttpClient
  ) {}

  findAllPaginated(
    sort: HubsdTableSortInterface,
    paginator: HubsdTablePaginatorInterface,
    filters?: PageFilterInterface
  ): Observable<{ data: { pages: PagePaginatedInterface } }> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query Pages(
          $filters: PageFiltersInput = {}
          $paginator: PaginatorInput = {}
          $sort: SortInput = {}
        ) {
          pages(filters: $filters, paginator: $paginator, sort: $sort) {
            rows {
              id
              domain
              facebookPixel
              facebookPixel
              tiktokPixel
              kwaiPixel
              url
              checkoutUrl
              hiddenFields
              user {
                id
                name
              }
              createdAt
              updatedAt
            }
            count
          }
        }
      `,
      variables: { filters, sort, paginator },
    }).valueChanges;
  }

  create(page: PageInterface): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>('@hubsd-api/pages', page);
  }

  findOne(id: number): Observable<PageInterface> {
    return this.httpClient.get<PageInterface>(`@hubsd-api/pages/${id}`);
  }

  update(application: PageInterface): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(
      `@hubsd-api/pages/${application.id}`,
      application
    );
  }
}
