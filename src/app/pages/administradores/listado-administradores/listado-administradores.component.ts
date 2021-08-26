import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PerfilService } from "src/app/shared/services/common/perfil.service";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { UsuariosService } from "src/app/shared/services/usuarios.service";
import { ENV } from "src/environments/environment";

@Component({
  selector: 'app-listado-administradores',
  templateUrl: './listado-administradores.component.html',
  styleUrls: ['./listado-administradores.component.scss']
})
export class ListadoAdministradoresComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  administradores = [];

  constructor(
    public utils: UtilsService,
    private usuariosService: UsuariosService,
    private perfilService: PerfilService

  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Listado de Administradores',
      b: [{ n: 'Listado de Administradores', r: '/administradores' }]
    });

    this.getAdministradores();
  }

  async getAdministradores() {
    this.utils.setLoading(true);
    this.usuariosService.find({ tipoUsuario: 'ADMIN' }).then((res: any) => {
      this.administradores = res.data;
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['foto', 'nombres', "apellido_paterno", "email", "telefono", "fechaRegistro", "estado", "acciones"];
    this.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.length = this.dataSource.filteredData.length;
  }

  async openForm(id = null){
    await this.perfilService.openFormPerfilAdmin(id);
    this.getAdministradores();
  }

}