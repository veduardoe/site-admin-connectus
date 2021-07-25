import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";;
import { SharedModule } from "src/app/shared/share.module";
import { SolicitudesRoutingModule } from "./solicitudes-routing.module";
import { SolicitudesService } from "src/app/shared/services/solicitudes/solicitudes.servce";
import { ListadoSolicitudesComponent } from "./listado-solicitudes/listado-solicitudes.component";
import { GestionSolicitudComponent } from './gestion-solicitud/gestion-solicitud.component';
import { FormAcClientesComponent } from "src/app/shared/components/modals/form-ac-clientes/form-ac-clientes.component";
import { FormAcAgentesComponent } from "src/app/shared/components/modals/form-ac-agentes/form-ac-agentes.component";
import { ListadoAgendaComponent } from "./listado-agenda/listado-agenda.component";
import { OrderModule } from "ngx-order-pipe";
import { FuenteSolicitudPipe } from "src/app/shared/pipes/fuentes-solicitud.pipe";


@NgModule({
    imports: [
        SolicitudesRoutingModule,
        SharedModule,
        OrderModule
    ],
    declarations:[
        ListadoSolicitudesComponent,
        ListadoAgendaComponent,
        GestionSolicitudComponent,
    ],
    providers:[
        SolicitudesService,
        FuenteSolicitudPipe ,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents:[
        FormAcClientesComponent,
        FormAcAgentesComponent
    ]
})
export class SolicitudesModule { }
