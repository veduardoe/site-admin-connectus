import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutenticacionRoutingModule } from './autenticacion-routing.module';
import { LoginComponent } from './login/login.component';
import { AngularMaterialModule } from 'src/app/app.material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IngresoComponent } from './login/vistas/ingreso/ingreso.component';
import { NuevoIngresoComponent } from './login/vistas/nuevo-ingreso/nuevo-ingreso.component';
import { RecuperarClaveComponent } from './login/vistas/recuperar-clave/recuperar-clave.component';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { SharedModule } from 'src/app/shared/share.module';

@NgModule({
  declarations: [
    LoginComponent, 
    IngresoComponent, 
    NuevoIngresoComponent, 
    RecuperarClaveComponent
  ],
  providers:[],
  imports: [
    SharedModule,
    CommonModule,
    FlexLayoutModule,
    AutenticacionRoutingModule,
    AngularMaterialModule
  ]
})
export class AutenticacionModule { }
