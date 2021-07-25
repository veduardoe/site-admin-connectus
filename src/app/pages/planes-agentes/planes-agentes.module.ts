import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";;
import { SharedModule } from "src/app/shared/share.module";
import { PlanesAgentesRoutingModule } from "./planes-agentes-routing.module";
import { ListadoPlanesAgentesComponent } from "./listado-planes-agentes/listado-planes-agentes.component";
import { PlanesAgentesService } from "src/app/shared/services/planes-agentes/planes-agentes.service";


@NgModule({
    imports: [
        PlanesAgentesRoutingModule,
        SharedModule,
    ],
    declarations:[
        ListadoPlanesAgentesComponent,
    ],
    providers:[
        PlanesAgentesService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents:[
    ]
})
export class PlanesAgentesModule { }
