import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { PropiedadesService } from 'src/app/shared/services/propiedades/propiedades.service';

@Component({
  selector: 'app-tipos-propiedades',
  templateUrl: './tipos-propiedades.component.html',
  styleUrls: ['./tipos-propiedades.component.scss']
})
export class TiposPropiedadesComponent implements OnInit {

  txtTipoPropiedad;
  columns: string[] = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public utils: UtilsService,
    private propiedadesService: PropiedadesService
  ) { }

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Mantenedor de Tipos de Propiedades',
      b: [{ n: 'Mantenedor de Tipos de Propiedades', r: '/extras/tipos-propiedades' }]
    });

    this.getTiposPropiedades();
  }

  getTiposPropiedades() {
    this.txtTipoPropiedad = null;
    this.utils.setLoading(true);
    this.propiedadesService.findTiposPropiedades().then((res: any) => {
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['detalle', "acciones"];
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregarTipoPropiedad() {

    if (!this.txtTipoPropiedad) {
      return;
    }

    this.utils.setLoading(true);
    this.propiedadesService.postTiposPropiedades({ detalle: this.txtTipoPropiedad }).then(res => {
      this.getTiposPropiedades();
    }).catch(err => {
      this.utils.setLoading(false);
    });

  }

  borrarTipoPropiedad(id) {

    this.utils.fnMainDialog("Confirmación", "¿está seguro de eliminar el registro?", "confirm").subscribe(res => {
      if (res) {
        this.utils.setLoading(true);
        this.propiedadesService.deleteTiposPropiedades(id).then(res => {
          this.getTiposPropiedades();
        }).catch(err => {
          this.utils.setLoading(false);
        });
      }
    });

  }

}
