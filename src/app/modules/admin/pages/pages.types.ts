export interface PagePaginatedInterface {
  rows: PageInterface[];
  count: 10;
}

export interface PageFilterInterface {
  domain?: string;
  id?: number;
}
export interface PageInterface {
  id?: number;
  domain: string;
  facebookPixel: string;
  tiktokPixel: string;
  kwaiPixel: string;
  url: string;
  checkoutUrl: string;
  hiddenFields: string;
  texts: PageAuxInterface[];
  colors: PageAuxInterface[];
}

interface PageAuxInterface {
  current: string;
  replace: string;
}
