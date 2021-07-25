import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./pages/autenticacion/autenticacion.module').then(m => m.AutenticacionModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'agentes',
        loadChildren: () => import('./pages/agentes/agentes.module').then(m => m.AgentesModule)
    },
    {
        path: 'planes',
        loadChildren: () => import('./pages/planes-agentes/planes-agentes.module').then(m => m.PlanesAgentesModule)
    },
    {
        path: 'clientes',
        loadChildren: () => import('./pages/clientes/clientes.module').then(m => m.ClientesModule)
    },
    {
        path: 'administradores',
        loadChildren: () => import('./pages/administradores/administradores.module').then(m => m.AdministradoresModule)
    },
    {
        path: 'propiedades',
        loadChildren: () => import('./pages/propiedades/propiedades.module').then(m => m.PropiedadesModule)
    },
    {
        path: 'solicitudes',
        loadChildren: () => import('./pages/solicitudes/solicitudes.module').then(m => m.SolicitudesModule)
    },
    {
        path: 'ganancias',
        loadChildren: () => import('./pages/ganancias/ganancias.module').then(m => m.GananciasModule)
    },
    {
        path: 'extras',
        loadChildren: () => import('./pages/extras/extras.module').then(m => m.ExtrasModule)
    },
    {
        path: '',
        redirectTo: 'login/admin',
        pathMatch: 'full'
    }
];

export const AppRouting = RouterModule.forRoot(routes, { useHash: false, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' });
