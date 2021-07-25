import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/shared/services/common/utils.service';
import { PropiedadesService } from 'src/app/shared/services/propiedades/propiedades.service';

@Component({
  selector: 'app-amenidades',
  templateUrl: './amenidades.component.html',
  styleUrls: ['./amenidades.component.scss']
})
export class AmenidadesComponent implements OnInit {

  txtAmenidad;
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
      t: 'Mantenedor de Amenidades',
      b: [{ n: 'Mantenedor de Amenidades', r: '/extras/amenidades' }]
    });

    this.getAmenidades();
  }

  getAmenidades(){
    this.txtAmenidad = null;
    this.utils.setLoading(true);
    this.propiedadesService.findAmenidades().then((res: any) => {
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

  agregarAmenidad(){

    if(!this.txtAmenidad){
      return;
    }

    this.utils.setLoading(true);
    this.propiedadesService.postAmenidades({detalle:this.txtAmenidad }).then( res => {
      this.getAmenidades();
    }).catch( err => {
      this.utils.setLoading(false);
    });

  }

  borrarAmenidad(id){
    
    this.utils.fnMainDialog("Confirmación", "¿está seguro de eliminar el registro?", "confirm").subscribe( res => {
      if(res){
        this.utils.setLoading(true);
        this.propiedadesService.deleteAmenidades(id).then( res => {
          this.getAmenidades();
        }).catch( err => {
          this.utils.setLoading(false);
        });
      }
    });

  }
}
