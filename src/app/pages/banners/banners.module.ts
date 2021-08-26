import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { BannersService } from "src/app/shared/services/banners.service";
import { PerfilService } from "src/app/shared/services/common/perfil.service";
import { UsuariosService } from "src/app/shared/services/usuarios.service";
import { SharedModule } from "src/app/shared/share.module";
import { BannersRoutingModule } from "./banners-routing.module";
import { ListadoBannersComponent } from "./listado-banners/listado-banners.component";

@NgModule({
    imports: [
        BannersRoutingModule,
        SharedModule,
    ],
    declarations:[
        ListadoBannersComponent,
    ],
    providers:[
       UsuariosService,
       PerfilService,
       BannersService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents:[]
})
export class BannersModule { }
