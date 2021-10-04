import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./pages/autenticacion/autenticacion.module').then(m => m.AutenticacionModule)
    },
    {
        path: 'administradores',
        loadChildren: () => import('./pages/administradores/administradores.module').then(m => m.AdministradoresModule)
    },
    {
        path: 'events',
        loadChildren: () => import('./pages/eventos/eventos.module').then(m => m.EventosModule)
    },
    {
        path: 'downloadable-category',
        loadChildren: () => import('./pages/descargables/descargables.module').then(m => m.DescargablesModule)
    },
    {
        path: 'banners',
        loadChildren: () => import('./pages/banners/banners.module').then(m => m.BannersModule)
    },
    {
        path: 'common',
        loadChildren: () => import('./pages/common/common.module').then(m => m.CommonModule)
    },
    {
        path: 'public-articles',
        loadChildren: () => import('./pages/articulospublicos/articulospublicos.module').then(m => m.ArticulosPublicosModule)
    },
    {
        path: 'social-network',
        loadChildren: () => import('./pages/redsocial/redsocial.module').then(m => m.RedsocialModule)
    },
    {
        path: '',
        redirectTo: 'login/admin',
        pathMatch: 'full'
    }
];

export const AppRouting = RouterModule.forRoot(routes, { useHash: false, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' });
