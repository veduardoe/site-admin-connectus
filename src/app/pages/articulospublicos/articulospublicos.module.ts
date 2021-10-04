import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { FormArticulosPublicosComponent } from "src/app/shared/components/modals/form-articulospublicos/form-articulospublicos.component";
import { ArticulosService } from "src/app/shared/services/articulos.service";
import { CategoriasService } from "src/app/shared/services/categorias.service";
import { SharedModule } from "src/app/shared/share.module";
import { ArticulosPublicosRoutingModule } from "./articulospublicos-routing.module";
import { ListadoArticulosPublicosComponent } from "./listado-articulospublicos/listado-articulospublicos.component";

@NgModule({
    imports: [
        ArticulosPublicosRoutingModule,
        SharedModule
    ],
    declarations: [
        ListadoArticulosPublicosComponent
    ],
    providers: [
        ArticulosService,
        CategoriasService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents: [
        FormArticulosPublicosComponent
    ]
})
export class ArticulosPublicosModule { }
