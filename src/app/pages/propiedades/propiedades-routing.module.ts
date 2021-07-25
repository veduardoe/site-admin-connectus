import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { FormPropiedadesComponent } from './form-propiedades/form-propiedades.component';
import { ListadoPropiedadesComponent } from './listado-propiedades/listado-propiedades.component';

const routes: Routes = [
  { path: '', component : ListadoPropiedadesComponent, canActivate:[AutenticacionService], data: {expected: ['*']}  },
  { path: 'referencia/:idAgente', component : ListadoPropiedadesComponent, canActivate:[AutenticacionService], data: {expected: ['ADMIN']}  },
  { path: 'detalle', component : FormPropiedadesComponent, canActivate:[AutenticacionService], data: {expected: ['*']}  },
  { path: 'detalle/:id', component : FormPropiedadesComponent, canActivate:[AutenticacionService], data: {expected: ['*']}  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropiedadesRoutingModule { }
