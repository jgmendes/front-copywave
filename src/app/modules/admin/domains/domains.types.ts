export interface DomainsInterface {
  id?: number;
  url: string;
  status: string;
  type: string;
}

export interface DomainsPaginatedInterface {
  count: number;
  rows: DomainsInterface[];
}

export interface DomainsFilterInterface {
  key: string;
}
