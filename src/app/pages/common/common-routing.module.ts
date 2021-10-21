import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { ListadoCategoriasComponent } from './listado-categorias/listado-categorias.component';

const routes: Routes = [
  {
    path: 'categories',
    component: ListadoCategoriasComponent,
    canActivate: [AutenticacionService],
    data: { expected: ['CATEGORIES_MANAGEMENT'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonRoutingModule { }
