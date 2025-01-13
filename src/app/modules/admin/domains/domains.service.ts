import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DomainsFilterInterface, DomainsInterface } from './domains.types';
import { Apollo, gql } from 'apollo-angular';
import {
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';

@Injectable({
  providedIn: 'root',
})
export class DomainsService {
  constructor(
    private readonly apollo: Apollo,
    private readonly httpClient: HttpClient
  ) {}

  findAllPaginated(
    sort: HubsdTableSortInterface,
    paginator: HubsdTablePaginatorInterface,
    filters?: DomainsFilterInterface
  ) {
    return this.apollo.watchQuery<any>({
      query: gql`
        query Domains(
          $filters: DomainsFiltersInput = {}
          $sort: SortInput = {}
          $paginator: PaginatorInput = {}
        ) {
          domains(filters: $filters, sort: $sort, paginator: $paginator) {
            count
            rows {
              id
              url
            }
          }
        }
      `,
      variables: { filters, sort, paginator },
    }).valueChanges;
  }

  findAll(): Observable<DomainsInterface[]> {
    return this.httpClient.get<DomainsInterface[]>('@hubsd-api/domains');
  }

  findOne(id: number): Observable<DomainsInterface> {
    return this.httpClient.get<DomainsInterface>(`@hubsd-api/domains/${id}`);
  }

  create(
    data: DomainsInterface
  ): Observable<{ message: string; parameter: DomainsInterface }> {
    return this.httpClient.post<{
      message: string;
      parameter: DomainsInterface;
    }>('@hubsd-api/domains', data);
  }

  update(
    id: number,
    data: DomainsInterface
  ): Observable<{ message: string; parameter: DomainsInterface }> {
    return this.httpClient.put<{
      message: string;
      parameter: DomainsInterface;
    }>(`@hubsd-api/domains/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `@hubsd-api/domains/${id}`
    );
  }
}
