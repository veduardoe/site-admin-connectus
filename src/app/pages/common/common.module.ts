import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { FormCategoriasComponent } from "src/app/shared/components/modals/form-categorias/form-categorias.component";
import { FormImagenesPerfilesComponent } from "src/app/shared/components/modals/form-imagenesperfiles/form-imagenesperfiles.component";
import { CategoriasService } from "src/app/shared/services/categorias.service";
import { ConfiguracionesService } from "src/app/shared/services/configuraciones.service";
import { ImagenesPerfilesService } from "src/app/shared/services/imagenesperfiles.service";
import { SharedModule } from "src/app/shared/share.module";
import { CommonRoutingModule } from "./common-routing.module";
import { ConfiguracionesComponent } from "./configuraciones/configuraciones.component";
import { ImagenesPerfilesComponent } from "./imagenes-perfiles/imagenes-perfiles.component";
import { ListadoCategoriasComponent, } from "./listado-categorias/listado-categorias.component";
import { InicioComponent } from './inicio/inicio.component';

@NgModule({
    imports: [
        CommonRoutingModule,
        SharedModule
    ],
    declarations: [
        ListadoCategoriasComponent,
        ImagenesPerfilesComponent,
        ConfiguracionesComponent,
        InicioComponent
    ],
    providers: [
        CategoriasService,
        ConfiguracionesService,
        ImagenesPerfilesService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents: [
        FormCategoriasComponent,
        FormImagenesPerfilesComponent
    ]
})
export class CommonModule { }
