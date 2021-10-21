import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { CategoriasService } from "src/app/shared/services/categorias.service";
import { EventosService } from "src/app/shared/services/eventos.service";
import { SharedModule } from "src/app/shared/share.module";
import { EventosRoutingModule } from "./eventos-routing.module";
import { ListadoEventosComponent } from "./listado-eventos/listado-eventos.component";
import { ListadoInscritosComponent } from "./listado-inscritos/listado-inscritos.component";

@NgModule({
    imports: [
        EventosRoutingModule,
        SharedModule,
    ],
    declarations:[
        ListadoEventosComponent,
        ListadoInscritosComponent
    ],
    providers:[
       EventosService,
       CategoriasService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents:[

    ]
})
export class EventosModule { }
