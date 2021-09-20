import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { ListadoEventosComponent } from './listado-eventos/listado-eventos.component';

const routes: Routes = [
  { path: '', component : ListadoEventosComponent, canActivate:[AutenticacionService], data: {expected: ['ADMIN']}  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
