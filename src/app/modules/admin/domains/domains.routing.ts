import { Route } from '@angular/router';
import { DomainsFormComponent } from './components/domains-form/domains-form.component';
import { DomainsListComponent } from './components/domains-list/domains-list.component';


export const domainsRoutes: Route[] = [
  {  
    path: '',
    component: DomainsListComponent,
    data: {
      title: 'Listar',
    }
  },
  {
    path: 'criar',
    component: DomainsFormComponent,
    data: {
      title: 'Criar',
    }
  },
  {
    path: 'editar/:id',
    component: DomainsFormComponent,
    data: {
      title: 'Editar',
    }
  }
];