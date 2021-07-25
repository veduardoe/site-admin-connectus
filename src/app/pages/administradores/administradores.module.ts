import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { PerfilService } from "src/app/shared/services/common/perfil.service";
import { PropiedadesService } from "src/app/shared/services/propiedades/propiedades.service";
import { UsuariosService } from "src/app/shared/services/usuarios/usuarios.service";
import { SharedModule } from "src/app/shared/share.module";
import { AdministradoresRoutingModule } from "./administradores-routing.module";
import { ListadoAdministradoresComponent } from "./listado-administradores/listado-administradores.component";


@NgModule({
    imports: [
        AdministradoresRoutingModule,
        SharedModule,
    ],
    declarations:[
        ListadoAdministradoresComponent,
    ],
    providers:[
       UsuariosService,
      //  PerfilService,
        PropiedadesService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents:[
    ]
})
export class AdministradoresModule { }
