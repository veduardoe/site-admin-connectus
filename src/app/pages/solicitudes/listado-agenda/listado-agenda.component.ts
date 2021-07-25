import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { SolicitudesService } from "src/app/shared/services/solicitudes/solicitudes.servce";
import { AutenticacionService } from "src/app/shared/services/autenticacion/autenticacion.service";
import { ActivatedRoute } from "@angular/router";
import { UsuariosService } from "src/app/shared/services/usuarios/usuarios.service";
import { ENV } from "src/environments/environment";
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-listado-agenda',
  templateUrl: './listado-agenda.component.html',
  styleUrls: ['./listado-agenda.component.scss']
})
export class ListadoAgendaComponent implements OnInit {

  columns: string[] = [];
  tipoUsuario;
  idAgente = null;
  dataSource: MatTableDataSource<any>;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  length = 0;
  agente;
  fechaFiltro = new Date();
  agendas = [];

  constructor(
    public utils: UtilsService,
    private solicitudesService: SolicitudesService,
    private auth: AutenticacionService,
    private aRoute: ActivatedRoute,
    private usuariosService: UsuariosService,
    private orderPipe: OrderPipe
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Listado de Agendas',
      b: [{ n: 'Listado de Agendas', r: '/agendas' }]
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
      let regs = this.transformToAgenda(res.data);
      if(param.idAgente){
        regs = this.filterByIdAgente(regs, param.idAgente);
      }
      this.agendas = regs;
      this.setTable(regs);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  filterByIdAgente(regs, idAgente){
    return regs.filter( item => {
      return item.idAgente === idAgente;
    });
  };

  setTable(data) {
    this.columns = ["referencia", "lugar", "fecha"];
    this.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  transformToAgenda(data){

    const itemsAgenda = [];
    data.forEach((sol, key) => {
      const ag = this.utils.getAgenteAsignado(sol.asignaciones);
      if(sol.visitas){
        sol.visitas.forEach((vis, kvis) => {
          const fechaVisita = new Date(vis.fecha.split("T")[0])
          if(fechaVisita.getDate() === this.fechaFiltro.getDate() &&
            fechaVisita.getMonth() === this.fechaFiltro.getMonth() &&
            fechaVisita.getFullYear() === this.fechaFiltro.getFullYear()){
              itemsAgenda.push({
                lugar:  vis.lugar,
                fecha: new Date(vis.fecha.split("T")[0]),
                fechaTime : (new Date(vis.fecha.split("T")[0])).getTime(),
                hora: vis.hora,
                idAgente: ag.idAgente,
                referencia : sol.referencia,
                idSolicitud: sol._id
              });
            }
        });
      }
    });

    return this.orderPipe.transform(itemsAgenda, 'fechaTime');
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.length = this.dataSource.filteredData.length;
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
        'Referencia',
        'Lugar',
        'Fecha',
      ],[]
    ];

    this.agendas.forEach((val, key) => {
      data.push([
        val.referencia,
        val.lugar,
        val.fecha, 
      ]);
    });

    if(this.agendas.length === 0){
      this.utils.fnMessage("No hay datos para ser exportados.");
      return;
    }
    this.utils.exportAsExcelFile(data, 'Agendas');
  }



}