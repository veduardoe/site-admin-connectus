import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { ImagenesPerfilesComponent } from './imagenes-perfiles/imagenes-perfiles.component';
import { InicioComponent } from './inicio/inicio.component';
import { ListadoCategoriasComponent } from './listado-categorias/listado-categorias.component';

const routes: Routes = [
  {
    path: 'categories',
    component: ListadoCategoriasComponent,
    canActivate: [AutenticacionService],
    data: { expected: ['CATEGORIES_MANAGEMENT'] }
  },
  {
    path: 'profile-images',
    component: ImagenesPerfilesComponent,
    canActivate: [AutenticacionService],
    data: { expected: ['PROFILE_IMAGES'] }
  },
  {
    path: 'configurations',
    component: ConfiguracionesComponent,
    canActivate: [AutenticacionService],
    data: { expected: ['CONFIGURATIONS'] }
  },
  {
    path: 'start',
    component: InicioComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonRoutingModule { }
