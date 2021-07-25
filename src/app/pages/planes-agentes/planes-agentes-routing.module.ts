import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { ListadoPlanesAgentesComponent } from './listado-planes-agentes/listado-planes-agentes.component';

const routes: Routes = [
  { path: '', component : ListadoPlanesAgentesComponent, canActivate:[AutenticacionService], data: {expected: ['ADMIN']}  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanesAgentesRoutingModule { }
