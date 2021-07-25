import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { ListadoAgentesComponent } from './listado-agentes/listado-agentes.component';

const routes: Routes = [
  { path: '', component : ListadoAgentesComponent, canActivate:[AutenticacionService], data: {expected: ['ADMIN']}  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentesRoutingModule { }
