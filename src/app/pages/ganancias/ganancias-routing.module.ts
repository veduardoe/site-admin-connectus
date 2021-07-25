import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { ListadoGananciasComponent } from './listado-ganancias/listado-ganancias.component';

const routes: Routes = [
    { path: '', component : ListadoGananciasComponent, canActivate:[AutenticacionService], data: {expected: ['ADMIN', 'AGENTE']}  },
    { path: ':idAgente', component : ListadoGananciasComponent, canActivate:[AutenticacionService], data: {expected: ['ADMIN']}  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GananciasRoutingModule { }
