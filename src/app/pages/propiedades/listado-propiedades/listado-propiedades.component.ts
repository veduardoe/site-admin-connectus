import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AutenticacionService } from 'src/app/shared/services/autenticacion/autenticacion.service';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { PropiedadesService } from 'src/app/shared/services/propiedades/propiedades.service';
import { UsuariosService } from 'src/app/shared/services/usuarios/usuarios.service';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-listado-propiedades',
  templateUrl: './listado-propiedades.component.html',
  styleUrls: ['./listado-propiedades.component.scss']
})
export class ListadoPropiedadesComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  picRoutePropiedades = ENV.PROPIEDADES;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  length = 0;
  agente;
  indicadores;
  propiedades = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public utils: UtilsService,
    private propiedadesService: PropiedadesService,
    private usuariosService: UsuariosService,
    private aRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Propiedades',
      b: [{ n: 'Propiedades', r: '/propiedades' }]
    })

    this.getPropiedades();
    this.indicadores = JSON.parse(localStorage.getItem('indicadores'));
  }

  async getPropiedades() {

    this.utils.setLoading(true);
    const param: any = await this.getParam();

    if(param && param.idAgente){
      this.getAgente(param.idAgente);
    }

    this.propiedadesService.find(param && param.idAgente ? { idAgenteAsignado: param.idAgente } : null).then((res: any) => {
      this.propiedades = this.trData(res.data);
      this.setTable(this.propiedades);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.setLoading(false);
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
    });

  }

  trData(data){
    return data.map(item => {
      const ag = item.agente[0];
      item.agenteAsignado = `${ag.nombres} ${ag.apellido_paterno} (${ag.tipoUsuario})`;
      return item;
    });
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


  setTable(data) {
    this.columns = ['foto', 'precio', 'titulo', 'agente', 'codigoReferencia', 
                    'tipoOperacion', 'region', 'comuna',  'habitaciones', 'banos', 
                    'metraje', 'estacionamiento', 'fechaRegistro', 'fechaModificacion', 'estado', "acciones"];
    this.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.length = this.dataSource.filteredData.length;
  }

  exportarExcel(){

    const data = [
      [
        'Título',
        'Precio',
        'Código',
        'Destacado',
        'Operación',
        'Región',
        'Comuna',
        'Dirección',
        'Tipo de Propiedad',
        'Fecha Registro',
        'Estado',
        'Agente'
      ],[]
    ];

    this.propiedades.forEach((val, key) => {
      data.push([
        val.titulo,
        `UF ${val.precio}`,
        val.codigoReferencia,
        val.destacado ? 'Si' : 'No',
        val.tipoOperacion,
        val.region,
        val.comuna, 
        val.direccion,
        val.idTipoPropiedad,
        val.fechaRegistro,
        val.estado,
        val.agenteAsignado
        
      ]);
    });

    if(this.propiedades.length === 0){
      this.utils.fnMessage("No hay datos para ser exportados.");
      return;
    }
    this.utils.exportAsExcelFile(data, 'Listado_Propiedades');
  }
}
