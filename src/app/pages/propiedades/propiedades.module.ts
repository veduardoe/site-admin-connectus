import { DragDropModule } from "@angular/cdk/drag-drop";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { FormEnviarDocumentoComponent } from "src/app/shared/components/modals/form-enviar-documento/form-enviar-documento.component";
import { PropiedadesService } from "src/app/shared/services/propiedades/propiedades.service";
import { UsuariosService } from "src/app/shared/services/usuarios/usuarios.service";
import { SharedModule } from "src/app/shared/share.module";
import { FormPropiedadesComponent } from "./form-propiedades/form-propiedades.component";
import { ListadoPropiedadesComponent } from "./listado-propiedades/listado-propiedades.component";
import { PropiedadesRoutingModule } from "./propiedades-routing.module";

@NgModule({
    imports: [
        PropiedadesRoutingModule,
        SharedModule,
        DragDropModule 
    ],
    declarations:[
        ListadoPropiedadesComponent,
        FormPropiedadesComponent
    ],
    providers:[
        PropiedadesService,
        UsuariosService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents:[
        FormEnviarDocumentoComponent
    ]
})
export class PropiedadesModule { }
