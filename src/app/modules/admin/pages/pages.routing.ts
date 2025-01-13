import { Route } from '@angular/router';

import { ViewPageComponent } from './components/pages-view/pages-view.component';
import { PagesSimpleComponent } from './components/pages-simple/pages-simple.component';
import { PagesManualComponent } from './components/pages-manual/pages-manual.component';
import { ApplicationsListComponent } from './components/pages-list/pages-list.component';

export const pageRoutes: Route[] = [
  {
    path: '',
    component: ApplicationsListComponent,
    data: {
      title: 'Listar',
    },
  },
  {
    path: 'manual/criar',
    component: PagesManualComponent,
    data: {
      title: 'Criar',
    },
  },
  {
    path: 'manual/editar/:id',
    component: PagesManualComponent,
    data: {
      title: 'Editar',
    },
  },
  {
    path: 'simples/criar',
    component: PagesSimpleComponent,
    data: {
      title: 'Criar',
    },
  },
  {
    path: 'simples/editar/:id',
    component: PagesSimpleComponent,
    data: {
      title: 'Editar',
    },
  },
  {
    path: 'visualizar/:id',
    component: ViewPageComponent,
    data: {
      title: 'Visualizar',
      layout: 'empty',
    },
  },
];
