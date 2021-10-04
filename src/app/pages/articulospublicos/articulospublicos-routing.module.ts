import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { ListadoArticulosPublicosComponent } from './listado-articulospublicos/listado-articulospublicos.component';

const routes: Routes = [
  { 
    path: '', 
    component: ListadoArticulosPublicosComponent, 
    canActivate: [AutenticacionService], 
    data: { expected: ['ADMIN'] } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticulosPublicosRoutingModule { }
