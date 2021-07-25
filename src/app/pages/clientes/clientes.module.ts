import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";;
import { SharedModule } from "src/app/shared/share.module";
import { ClientesRoutingModule } from "./clientes-routing.module";
import { ListadoClientesComponent } from "./listado-clientes/listado-clientes.component";
import { ClientesService } from "src/app/shared/services/clientes/clientes.service";


@NgModule({
    imports: [
        ClientesRoutingModule,
        SharedModule,
    ],
    declarations:[
        ListadoClientesComponent,
    ],
    providers:[
        ClientesService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents:[
    ]
})
export class ClientesModule { }
