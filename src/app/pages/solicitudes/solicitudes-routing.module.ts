import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { GestionSolicitudComponent } from './gestion-solicitud/gestion-solicitud.component';
import { ListadoAgendaComponent } from './listado-agenda/listado-agenda.component';
import { ListadoSolicitudesComponent } from './listado-solicitudes/listado-solicitudes.component';

const routes: Routes = [
  { path: '', component : ListadoSolicitudesComponent, canActivate:[AutenticacionService], data: {expected: ['ADMIN', 'AGENTE']}  },
  { path: 'v/:idAgente', component : ListadoSolicitudesComponent, canActivate:[AutenticacionService], data: {expected: ['ADMIN']}  },
  { path: 'detalle', component : GestionSolicitudComponent, canActivate:[AutenticacionService], data: {expected: ['ADMIN']}  },
  { path: 'detalle/:id', component : GestionSolicitudComponent, canActivate:[AutenticacionService], data: {expected: ['ADMIN', 'AGENTE']}  },
  { path: 'agenda/:idAgente', component : ListadoAgendaComponent, canActivate:[AutenticacionService], data: {expected: ['ADMIN']}  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudesRoutingModule { }
