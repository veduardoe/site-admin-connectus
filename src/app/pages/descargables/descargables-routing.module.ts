import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { ListadoCategoriasDescargablesComponent } from './listado-categoriasdescargables/listado-categoriasdescargables.component';
import { ListadoDescargablesComponent } from './listado-descargables/listado-descargables.component';

const routes: Routes = [
  { 
    path: '', 
    component: ListadoCategoriasDescargablesComponent, 
    canActivate: [AutenticacionService], 
    data: { expected: ['FILES'] } 
  },
  { 
    path: 'files/:id', 
    component: ListadoDescargablesComponent, 
    canActivate: [AutenticacionService], 
    data: { expected: ['FILES'] } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DescargablesRoutingModule { }
