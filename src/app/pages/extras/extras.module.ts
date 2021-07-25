import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { PropiedadesService } from "src/app/shared/services/propiedades/propiedades.service";
import { SharedModule } from "src/app/shared/share.module";
import { AmenidadesComponent } from "./amenidades/amenidades.component";
import { ExtrasRoutingModule } from "./extras-routing.module";
import { TiposPropiedadesComponent } from "./tipos-propiedades/tipos-propiedades.component";
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { HistoricoPagosPlanesComponent } from './historico-pagos-planes/historico-pagos-planes.component';
import { HistoricoPagosService } from "src/app/shared/services/historico-pagos/historico-pagos.service";
import { FormPagosComponent } from "src/app/shared/components/modals/form-pagos/form-pagos.component";

@NgModule({
    imports: [
        ExtrasRoutingModule,
        SharedModule,
        DragDropModule
    ],
    declarations:[
        TiposPropiedadesComponent,
        AmenidadesComponent,
        ConfiguracionComponent,
        ConfiguracionComponent,
        HistoricoPagosPlanesComponent
    ],
    providers:[
        PropiedadesService,
        HistoricoPagosService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },

    ],
    entryComponents:[
        FormPagosComponent
    ]
})
export class ExtrasModule { }
