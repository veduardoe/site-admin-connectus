import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FormPagosComponent } from 'src/app/shared/components/modals/form-pagos/form-pagos.component';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { HistoricoPagosService } from 'src/app/shared/services/historico-pagos/historico-pagos.service';
import { UsuariosService } from 'src/app/shared/services/usuarios/usuarios.service';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-historico-pagos-planes',
  templateUrl: './historico-pagos-planes.component.html',
  styleUrls: ['./historico-pagos-planes.component.scss']
})
export class HistoricoPagosPlanesComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  picRoutePropiedades = ENV.PROPIEDADES;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  mostrarBtnNuevo = false;
  tipoUsuario;
  length = 0;
  agente;
  indicadores;
  historico = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public utils: UtilsService,
    private historicoService: HistoricoPagosService,
    private usuariosService: UsuariosService,
    private aRoute: ActivatedRoute,
    private dialog: MatDialog,
    private auth: AutenticacionService
  ) { }

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Histórico de Pagos',
      b: [{ n: 'Histórico de Pagos', r: '/historico-pagos' }]
    });

    this.getHistorico();
    
    this.tipoUsuario = this.auth.getAuthInfo()['tipoUsuario'];
  }

  getParam() {
    return new Promise((resolve, reject) => {
      this.aRoute.params.subscribe(param => {
        resolve(param);
      });
    });
  }

  getAgente(id) {
    this.usuariosService.find({ _id: id }).then((res: any) => {
      this.agente = res.data[0];
    });
  }

  async getHistorico(){

    this.utils.setLoading(true);
    const param: any = await this.getParam();

    if(param && param.idAgente){
      this.getAgente(param.idAgente);
    }

    this.utils.setLoading(true);
    this.historicoService.find(param && param.idAgente ? { idAgente: param.idAgente } : null).then((res: any) => {
      this.historico = res.data;
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ["periodo", "plan", "monto", "fechaModificacion", "estado", "acciones"];
    this.length = data.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openForm(id: string = null) {

    let data = null;
    let idAgente = this.agente ? this.agente._id : null;
    if (id) {
      try {
        const reqData: any = await this.historicoService.find({ _id: id });
        data = reqData.data[0];
      } catch (err) {
        this.utils.fnMainDialog("Error", "No se encontró el Movimiento seleccionado.", "message");
        return false;
      }
    }

    const dForm = this.dialog.open(FormPagosComponent, {
      width: '90%',
      maxWidth: '720px',
      data: { data, idAgente },
      autoFocus: false,
      disableClose: true
    });

    dForm.componentInstance.dialogEvent.subscribe((result) => {
      this.dialog.closeAll();
      this.utils.fnSuccessSave();
      this.getHistorico();
    });

  }

  exportarExcel(){

    const data = [
      [
        'Agente:', this.agente.nombres  + ' ' + this.agente.apellido_paterno + ' '  + this.agente.apellido_materno
      ],
      [],
      [
        'Periodo',
        'Plan',
        'Monto',
        'Estado'
      ],[]
    ];

    this.historico.forEach((val, key) => {
      data.push([
        val.fechaDesde.split("T")[0] + ' A ' + val.fechaHasta.split("T")[0],
        val.planAgente?.nombre,
        val.monto,
        val.estado,
      ]);
    });

    if(this.historico.length === 0){
      this.utils.fnMessage("No hay datos para ser exportados.");
      return;
    }
    this.utils.exportAsExcelFile(data, 'Historico_Pagos');
  }




}
