import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { MatDialog } from "@angular/material/dialog";
import { SolicitudesService } from "src/app/shared/services/solicitudes/solicitudes.servce";
import { AutenticacionService } from "src/app/shared/services/autenticacion/autenticacion.service";
import { ActivatedRoute } from "@angular/router";
import { UsuariosService } from "src/app/shared/services/usuarios/usuarios.service";
import { ENV } from "src/environments/environment";
import { FuenteSolicitudPipe } from "src/app/shared/pipes/fuentes-solicitud.pipe";

@Component({
  selector: 'app-listado-solicitudes',
  templateUrl: './listado-solicitudes.component.html',
  styleUrls: ['./listado-solicitudes.component.scss']
})
export class ListadoSolicitudesComponent implements OnInit {

  columns: string[] = [];
  tipoUsuario;
  idAgente = null;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  dataSource: MatTableDataSource<any>;
  length = 0;
  agente;
  solicitudes = [];
  constructor(
    public utils: UtilsService,
    private solicitudesService: SolicitudesService,
    private auth: AutenticacionService,
    private aRoute: ActivatedRoute,
    private usuariosService: UsuariosService,
    private fuentePipe: FuenteSolicitudPipe
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Listado de Solicitudes',
      b: [{ n: 'Listado de Solicitudes', r: '/solicitudes' }]
    });
    this.tipoUsuario = this.auth.getAuthInfo()['tipoUsuario'];
    this.idAgente = this.auth.getAuthInfo()['id']
    this.getSolicitudes();
  }

  async getSolicitudes() {

    const param: any = await this.getParam();
    let filter = null;

    if (param.idAgente) {
      this.getAgente(param.idAgente);
    }

    this.utils.setLoading(true);
    this.solicitudesService.find(filter).then((res: any) => {
      let regs = this.trData(res.data);
      if(param.idAgente){
        regs = this.filterByIdAgente(regs, param.idAgente);
      }
      this.solicitudes = regs;
      this.setTable(regs);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  trData(data){
    return data.map( item => {
      const ag = this.utils.getAgenteAsignado(item.asignaciones);
      item.nomAgente = ag.detalle;
      item.idAgente = ag.idAgente;
      return item;
    })
  }

  filterByIdAgente(regs, idAgente){
    return regs.filter( item => {
      return item.idAgente === idAgente;
    });
  };

  setTable(data) {
    if (this.tipoUsuario === 'ADMIN') {
      this.columns = ['fuente', "referencia", "agente", "fechaRegistro", "fechaAsignacion", "estado", "acciones"];
    } else {
      this.columns = ['fuente', "referencia", "fechaRegistro", "fechaAsignacion", "estadoAgente", "acciones"];
    }

    this.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.length = this.dataSource.filteredData.length;
  }

  getSolAg(e) {
    const as = this.utils.getAgenteAsignado(e.asignaciones);
    return this.idAgente === as.idAgente && as.estado !== 'REASIGNADO';
  }

  getAgente(id) {
    this.usuariosService.find({ _id: id }).then((res: any) => {
      this.agente = res.data[0];
    });
  }

  getParam() {
    return new Promise((resolve, reject) => {
      this.aRoute.params.subscribe(param => {
        resolve(param);
      });
    });
  }

  exportarExcel(){

    const data = [
      [
        'Fuente',
        'Referencia',
        'Agente',
        'Fecha Registro',
      ],[]
    ];

    this.solicitudes.forEach((val, key) => {
      data.push([
        this.fuentePipe.transform(val.fuente),
        val.referencia,
        val.estado === 'SIN_ASIGNAR' ? 'SIN ASIGNACIÓN' : val.nomAgente,
        val.fechaRegistro, 
      ]);
    });

    if(this.solicitudes.length === 0){
      this.utils.fnMessage("No hay datos para ser exportados.");
      return;
    }
    this.utils.exportAsExcelFile(data, 'Solicitudes');
  }


}