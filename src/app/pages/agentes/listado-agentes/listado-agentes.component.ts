import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { UsuariosService } from "src/app/shared/services/usuarios/usuarios.service";
import { PerfilService } from "src/app/shared/services/common/perfil.service";
import { ENV } from "src/environments/environment";

@Component({
  selector: 'app-listado-agentes',
  templateUrl: './listado-agentes.component.html',
  styleUrls: ['./listado-agentes.component.scss']
})
export class ListadoAgentesComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  agentes = [];

  constructor(
    public utils: UtilsService,
    private usuariosService: UsuariosService,
    private perfilService: PerfilService
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Listado de Agentes',
      b: [{ n: 'Listado de Agentes', r: '/agentes' }]
    });

    this.getAgentes();
  }

  async getAgentes() {
    this.utils.setLoading(true);
    this.usuariosService.find({ tipoUsuario: 'AGENTE' }).then((res: any) => {
      this.agentes = res.data;
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['foto', 'nombres', "apellido_paterno", "rut", "email", "telefono", "fechaRegistro", "estado", "acciones"];
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
    await this.perfilService.openFormAgente(id);
    this.getAgentes();
  }

  exportarExcel(){

    const data = [
      [
        'Nombres',
        'Apellido',
        'Rut',
        'Email',
        'Telefono',
        'Estado',
        'Fecha Registro',
      ],[]
    ];

    this.agentes.forEach((val, key) => {
      data.push([
        val.nombres,
        val.apellido_paterno,
        val.rut,
        val.email,
        val.telefono,
        val.estado, 
        val.fechaRegistro
      ]);
    });

    if(this.agentes.length === 0){
      this.utils.fnMessage("No hay datos para ser exportados.");
      return;
    }
    this.utils.exportAsExcelFile(data, 'Agentes');
  }
}