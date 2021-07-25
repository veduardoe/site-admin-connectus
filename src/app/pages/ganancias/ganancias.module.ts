import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { FormGananciasComponent } from "src/app/shared/components/modals/form-ganancias/form-gananacias.component";
import { GananciasService } from "src/app/shared/services/ganancias/ganancias.service";
import { HistoricoPagosService } from "src/app/shared/services/historico-pagos/historico-pagos.service";
import { SharedModule } from "src/app/shared/share.module";
import { GananciasRoutingModule } from "./ganancias-routing.module";
import { ListadoGananciasComponent } from "./listado-ganancias/listado-ganancias.component";

@NgModule({
    imports: [
        GananciasRoutingModule,
        SharedModule,
    ],
    declarations:[
        ListadoGananciasComponent,
    ],
    providers:[
        GananciasService,
        HistoricoPagosService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents:[
        FormGananciasComponent
    ]
})
export class GananciasModule { }
