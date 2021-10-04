import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { FormArticulosPublicosComponent } from "src/app/shared/components/modals/form-articulospublicos/form-articulospublicos.component";
import { SharedModule } from "src/app/shared/share.module";
import { RedsocialRoutingModule } from "./redsocial-routing.module";
import { ListadoPostsComponent } from "./listado-postsarticulos/listado-postsarticulos.component";
import { PostsService } from "src/app/shared/services/posts.service";
import { CategoriasService } from "src/app/shared/services/categorias.service";
import { ViewPostComponent } from "src/app/shared/components/modals/view-post/view-post.component";
import { UsuariosService } from "src/app/shared/services/usuarios.service";
import { ListadoUsuariosPostsComponent } from "./listado-usuariospostsarticulos/listado-usuariospostsarticulos.component";

@NgModule({
    imports: [
        RedsocialRoutingModule,
        SharedModule
    ],
    declarations: [
        ListadoPostsComponent,
        ListadoUsuariosPostsComponent
    ],
    providers: [
        PostsService,
        CategoriasService,
        UsuariosService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    entryComponents: [
        ViewPostComponent
    ]
})
export class RedsocialModule { }
