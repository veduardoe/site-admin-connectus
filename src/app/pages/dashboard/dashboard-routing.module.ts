import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardAgentesComponent } from './dashboard-agentes/dashboard-agentes.component';

const routes: Routes = [
  { path: 'agente', component : DashboardAgentesComponent, canActivate:[AutenticacionService], data: {expected: ['*']}  },
  { path: 'admin', component : DashboardAdminComponent, canActivate:[AutenticacionService]  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
