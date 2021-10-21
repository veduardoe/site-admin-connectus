import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { ListadoEventosComponent } from './listado-eventos/listado-eventos.component';
import { ListadoInscritosComponent } from './listado-inscritos/listado-inscritos.component';

const routes: Routes = [
  { path: '', component : ListadoEventosComponent, canActivate:[AutenticacionService], data: {expected: ['EVENTS']}  },
  { path: 'subscribers/:idEvento/:nombreEvento', component : ListadoInscritosComponent, canActivate:[AutenticacionService], data: {expected: ['EVENTS']}  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
