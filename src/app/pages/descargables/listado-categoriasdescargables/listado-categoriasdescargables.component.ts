import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormCategoriasDescargablesComponent } from "src/app/shared/components/modals/form-categoriasdescargables/form-categoriasdescargables.component";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { ContenidosDescargablesService } from "src/app/shared/services/descargables.service";
import { ENV } from "src/environments/environment";

@Component({
  selector: 'app-listado-categoriasdescargables',
  templateUrl: './listado-categoriasdescargables.component.html',
  styleUrls: ['./listado-categoriasdescargables.component.scss']
})
export class ListadoCategoriasDescargablesComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  routeStorage = ENV.STORAGE;
  pathFicheros = '/contenidosdescargables%2F'
  categoriasDescargables = [];
  idioma = 'EN';

  constructor(
    public utils: UtilsService,
    public descargablesService: ContenidosDescargablesService,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Downloadbles Categories',
      b: [{ n: 'Downloadbles Categories', r: '/downloadable-category' }]
    });
    this.getCategoriasDescargables();

  }

  async getCategoriasDescargables() {
    this.utils.setLoading(true);
    this.descargablesService.findCategory({ idioma : this.idioma }).then((res: any) => {
      this.categoriasDescargables = res.data;
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['fotoPortada', 'titulo', "descripcion", "idioma", "habilitar", "acciones"];
    this.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.length = this.dataSource.filteredData.length;
  }

  openForm(id: string = null, from = null) {

    return new Promise(async (resolve) => {

      let data = null;

      if (id) {
        try {
          const find = from ? {} : { id };
          const reqData: any = await this.descargablesService.findCategory(find);
          data = reqData.data[0];
          data.from = from;
        } catch (err) {
          this.utils.fnMainDialog("Error", "Selected category has not been found.", "message");
          return false;
        }
      }

      const dForm = this.dialog.open(FormCategoriasDescargablesComponent, {
        width: '90%',
        maxWidth: '720px',
        data: { data },
        autoFocus: false,
        disableClose: true
      });

      dForm.componentInstance.dialogEvent.subscribe((result) => {
        this.dialog.closeAll();
        this.utils.fnSuccessSave();
        this.getCategoriasDescargables();
        resolve(true);
      });

    });

  }

}