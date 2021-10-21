import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { ListadoAdministradoresComponent } from './listado-administradores/listado-administradores.component';

const routes: Routes = [
  { path: '', component : ListadoAdministradoresComponent, canActivate:[AutenticacionService], data: {expected: ['ADMINS']}  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradoresRoutingModule { }
