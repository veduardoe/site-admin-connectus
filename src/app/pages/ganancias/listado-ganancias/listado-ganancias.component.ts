import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FormGananciasComponent } from 'src/app/shared/components/modals/form-ganancias/form-gananacias.component';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { GananciasService } from 'src/app/shared/services/ganancias/ganancias.service';
import { UsuariosService } from 'src/app/shared/services/usuarios/usuarios.service';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-listado-ganancias',
  templateUrl: './listado-ganancias.component.html',
  styleUrls: ['./listado-ganancias.component.scss']
})
export class ListadoGananciasComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  agente;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  tipoUsuario;
  idAgente;
  ganancias = [];

  constructor(
    public utils: UtilsService,
    private gananciasService: GananciasService,
    private usuariosService: UsuariosService,
    private aRoute: ActivatedRoute,
    private dialog: MatDialog,
    private auth:AutenticacionService
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async ngOnInit() {

    const param: any = await this.getParam();

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Histórico de Captaciones y Ganancias',
      b: [{ n: 'Histórico de Captaciones y Ganancias', r: '/ganancias/' + param.idAgente }]
    });

    this.tipoUsuario = this.auth.getAuthInfo()['tipoUsuario'];
    this.idAgente = this.auth.getAuthInfo()['id'];

    this.getGanancias();
  }

  async getGanancias() {

    const param: any = await this.getParam();

    if (param && param.idAgente) {
      this.getAgente(param.idAgente);
    }

    this.utils.setLoading(true);
    this.gananciasService.find(param && param.idAgente ? { idAgente: param.idAgente } : null).then((res: any) => {
      this.setTable(this.trData(res.data));
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });

  }

  trData(data){
    return data.map( item => {
      item.referenciaSolicitud = item.solicitud[0].referencia;
      item.plan = item.planesAgentes[0].nombre;
      return item;
    })
  }

  setTable(data) {
    this.ganancias = data;
    this.columns = ['solicitud', "precioPropiedad", "plan", "montoComision", "montoGanancia", "estado", "acciones"];
    this.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.length = this.dataSource.filteredData.length;
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


  async openForm(id: string = null) {

    let data = null;

    if (id) {
      try {
        const reqData: any = await this.gananciasService.find({ _id: id });
        data = reqData.data[0];
      } catch (err) {
        this.utils.fnMainDialog("Error", "No se encontró el registro seleccionado.", "message");
        return false;
      }
    }

    const dForm = this.dialog.open(FormGananciasComponent, {
      width: '90%',
      maxWidth: '720px',
      data: { data, ganancias: this.ganancias, idAgente: this.agente ? this.agente._id : this.idAgente},
      autoFocus: false,
      disableClose: true
    });

    dForm.componentInstance.dialogEvent.subscribe((result) => {
      this.dialog.closeAll();
      this.utils.fnSuccessSave();
      this.getGanancias();
    });
  }

}
