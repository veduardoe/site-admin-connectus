import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { FormCategoriasDescargablesComponent } from "src/app/shared/components/modals/form-categoriasdescargables/form-categoriasdescargables.component";
import { ContenidosDescargablesService } from "src/app/shared/services/descargables.service";
import { SharedModule } from "src/app/shared/share.module";
import { DescargablesRoutingModule } from "./descargables-routing.module";
import { ListadoCategoriasDescargablesComponent } from "./listado-categoriasdescargables/listado-categoriasdescargables.component";
import { ListadoDescargablesComponent } from "./listado-descargables/listado-descargables.component";

@NgModule({
    imports: [
        DescargablesRoutingModule,
        SharedModule
    ],
    declarations: [
        ListadoCategoriasDescargablesComponent,
        ListadoDescargablesComponent
    ],
    providers: [
        ContenidosDescargablesService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents: [
        FormCategoriasDescargablesComponent
    ]
})
export class DescargablesModule { }
