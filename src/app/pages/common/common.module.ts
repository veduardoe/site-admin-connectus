import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { FormCategoriasComponent } from "src/app/shared/components/modals/form-categorias/form-categorias.component";
import { FormCategoriasDescargablesComponent } from "src/app/shared/components/modals/form-categoriasdescargables/form-categoriasdescargables.component";
import { CategoriasService } from "src/app/shared/services/categorias.service";
import { SharedModule } from "src/app/shared/share.module";
import { CommonRoutingModule } from "./common-routing.module";
import { ListadoCategoriasComponent, } from "./listado-categorias/listado-categorias.component";

@NgModule({
    imports: [
        CommonRoutingModule,
        SharedModule
    ],
    declarations: [
        ListadoCategoriasComponent
    ],
    providers: [
        CategoriasService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents: [
        FormCategoriasComponent
    ]
})
export class CommonModule { }
