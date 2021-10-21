import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { ListadoPostsComponent } from './listado-postsarticulos/listado-postsarticulos.component';
import { ListadoUsuariosPostsComponent } from './listado-usuariospostsarticulos/listado-usuariospostsarticulos.component';

const routes: Routes = [
  { 
    path: 'sn-posts-articles', 
    component: ListadoPostsComponent, 
    canActivate: [AutenticacionService], 
    data: { expected: ['SOCIAL_POSTS', 'SOCIAL_NETWORKS_USERS'] } 
  },
  { 
    path: 'sn-users', 
    component: ListadoUsuariosPostsComponent, 
    canActivate: [AutenticacionService], 
    data: { expected: ['SOCIAL_NETWORKS_USERS'] } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedsocialRoutingModule { }
