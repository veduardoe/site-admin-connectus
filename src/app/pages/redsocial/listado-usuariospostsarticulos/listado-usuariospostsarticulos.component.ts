import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { ViewPostComponent } from "src/app/shared/components/modals/view-post/view-post.component";
import { CategoriasService } from "src/app/shared/services/categorias.service";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { PostsService } from "src/app/shared/services/posts.service";
import { UsuariosService } from "src/app/shared/services/usuarios.service";
import { ENV } from "src/environments/environment";

@Component({
  selector: 'app-listado-usuariospostsarticulos',
  templateUrl: './listado-usuariospostsarticulos.component.html',
  styleUrls: ['./listado-usuariospostsarticulos.component.scss']
})
export class ListadoUsuariosPostsComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  routeStorage = ENV.STORAGE;
  pathPerfil = '/fotos-perfil%2F'
  usuarios = [];
  estado = 'NA';


  constructor(
    public utils: UtilsService,
    public usuariosService: UsuariosService,
    public dialog: MatDialog,
    public categoriasService: CategoriasService,
    public router:Router
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Social Network Users',
      b: [{ n: 'Social Network Users', r: '/sn-users' }]
    });
    this.getRSUsuarios();

  }

  async getRSUsuarios() {

    this.utils.setLoading(true);
    let filter:any = {};

    if(this.estado !== 'NA'){
      filter.estado = this.estado;
    }

    this.usuariosService.findUsuariosRS(filter).then((res: any) => {
      this.usuarios = res.data;
      this.setTable(this.transformUsername(res.data));
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['userdata', "email","telefono", "summary", "fechaRegistro","estado"];
    this.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.length = this.dataSource.filteredData.length;
  }

  transformUsername(items){
    return items.map( d => {
      d.userdata = d.nombres + ' ' + d.apellidos;
      return d;
    });
  }

  getPostFromUsuario(info){
    this.router.navigate(['/social-network/sn-posts-articles'], {
      queryParams: {id: info._id, name: info.userdata }
    });
  }

  changeStatus(idUsuario, status){
    const txt =  status === 'ACTIVO' ? 'LOCK' : 'ACTIVATE';
    status = status === 'ACTIVO' ? 'BLOQUEADO' : 'ACTIVO';
    this.utils.fnMainDialog('Confirm', 'are you sure to <b>' + txt +'</b> the user?', 'confirm').subscribe( res => {
      if(res){
        this.usuariosService.setStatusUser(idUsuario, status).then( (res:any) => {
          if(res.response){
            this.getRSUsuarios();
          }else{
            this.utils.fnError();
          }
        }).catch( err => {
          this.utils.fnError();
        });
      }
    });

  }
    


}