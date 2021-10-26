import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { FormArticulosPublicosComponent } from "src/app/shared/components/modals/form-articulospublicos/form-articulospublicos.component";
import { ViewPostComponent } from "src/app/shared/components/modals/view-post/view-post.component";
import { ArticulosService } from "src/app/shared/services/articulos.service";
import { CategoriasService } from "src/app/shared/services/categorias.service";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { PostsService } from "src/app/shared/services/posts.service";
import { ENV } from "src/environments/environment";

@Component({
  selector: 'app-listado-postsarticulos',
  templateUrl: './listado-postsarticulos.component.html',
  styleUrls: ['./listado-postsarticulos.component.scss']
})
export class ListadoPostsComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  routeStorage = ENV.STORAGE;
  pathPerfil = '/fotos-perfil%2F'
  posts = [];
  categorias = [];
  tipoPost = 'NA';
  categoria = 'NA';
  estado = 'NA';
  idUsuario;
  usuarioClickedInfo;
  fromQuery = false;

  constructor(
    public utils: UtilsService,
    public postsService: PostsService,
    public dialog: MatDialog,
    public categoriasService: CategoriasService,
    public aRouter:ActivatedRoute
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Social Network Posts & Articles',
      b: [{ n: 'Social Network Posts & Articles', r: '/sn-posts-articles' }]
    });

    this.aRouter.queryParams.subscribe( params => {
      if(params.id){
        this.idUsuario = params.id;
        this.usuarioClickedInfo = params.name;
        this.fromQuery = true;
      }
      this.getPosts();
      this.getCategorias();
    });

  }

  getCategorias(){
    this.categoriasService.find({}).then((res:any) => {
      this.categorias = res.data;
    });
  }

  async getPosts() {

    this.utils.setLoading(true);
    let filter:any = {};
    if(this.idUsuario ){
      filter.idUsuario = this.idUsuario;
    }

    if(this.categoria && this.categoria !== 'NA'){
      filter.idCategoria = this.categoria;
    }

    if(this.estado !== 'NA'){
      filter.estado = this.estado;
    }

    if(this.tipoPost !== 'NA'){
      filter.tipoPost = this.tipoPost;
    }

    this.postsService.getPosts(filter).then((res: any) => {
      this.posts = res.data;
      this.setTable(this.transformResponse(res.data));
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['detalle', 'usuario', "nlikes", "picfiles","tipoPost", "fechaRegistro", "acciones","estado"];
    this.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.length = this.dataSource.filteredData.length;
  }

  openForm(id: string = null, from = null) {

    return new Promise(async (resolve) => {

      let data = null;

      if (id) {
        try {
          const find = from ? {} : { id };
          const reqDataPost: any = this.postsService.getPosts(find);
          const reqDataComments: any = this.postsService.getComentarios({ idPost: id});
          const [reqData, reqDataCom] = await Promise.all([reqDataPost, reqDataComments])
          data = { post: reqData.data[0], comentarios: reqDataCom.comentarios };
          data.from = from;
        } catch (err) {
          this.utils.fnMainDialog("Error", "Selected post has not been found.", "message");
          return false;
        }
      }

      const dForm = this.dialog.open(ViewPostComponent, {
        width: '90%',
        maxWidth: '940px',
        data: { data },
        autoFocus: false,
        disableClose: true
      });

      dForm.afterClosed().subscribe((result) => {
        this.dialog.closeAll();
        this.getPosts();
        resolve(true);
      });

    });

  }

  transformResponse(posts){
    return posts.map( item => {
      let counterPics = 0;
      let counterFiles = 0
      item.ficheros.forEach((val, key) => {
        if (val.type === 'pic') {
          counterPics++;
        }
        if (val.type === 'doc') {
          counterFiles++;
        }
      });

      return {
        idPost: item?._id,
        idUsuario: item?.usuario.id,
        usuario: `${item?.usuario.nombres} ${item?.usuario.apellidos}`,
        detalle: item.tipoPost === 'ARTICLE' ? item.titulo : item.detalle,
        foto: item?.usuario.foto,
        nlikes: item.likes.length,
        ncomments: item.comentarios.length,
        fechaRegistro: item.fechaRegistro,
        tipoPost: item.tipoPost,
        estado: item.estado,
        denuncias: item.denuncias,
        counterPics,
        counterFiles,
        fullData: item
      }

    });

  }

  getPostFromUsuario(u){
    this.idUsuario = u?.idUsuario;
    this.usuarioClickedInfo = u.usuario;
    this.getPosts();
  }

  removePostsFromUsuario(){
    this.idUsuario = null;
    this.usuarioClickedInfo = null;
    this.fromQuery = false;
    this.getPosts();
  }
}