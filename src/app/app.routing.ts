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
        path: 'banners',
        loadChildren: () => import('./pages/banners/banners.module').then(m => m.BannersModule)
    },
    {
        path: '',
        redirectTo: 'login/admin',
        pathMatch: 'full'
    }
];

export const AppRouting = RouterModule.forRoot(routes, { useHash: false, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' });
