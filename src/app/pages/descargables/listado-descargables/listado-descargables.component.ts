import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { FormDescargablesComponent } from "src/app/shared/components/modals/form-descargables/form-descargables.component";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { ContenidosDescargablesService } from "src/app/shared/services/descargables.service";
import { ENV } from "src/environments/environment";

@Component({
  selector: 'app-listado-descargables',
  templateUrl: './listado-descargables.component.html',
  styleUrls: ['./listado-descargables.component.scss']
})
export class ListadoDescargablesComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  routeStorage = ENV.STORAGE;
  pathFicheros = '/contenidosdescargables%2F'
  descargables = [];
  idCategory = null;
  idCategoriaDescargable;

  constructor(
    public utils: UtilsService,
    public descargablesService: ContenidosDescargablesService,
    public activateRoute: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.activateRoute.params.subscribe(async param => {

      if (param?.id) {
        this.idCategoriaDescargable = param?.id;
        const ctg: any = await this.getCategoriasDescargables(param?.id);
        if (ctg) {
          this.utils.fnBreadcrumbsState().setBreadcrumbsState({
            t: 'Files (' + ctg.titulo + ' - ' + ctg.descripcion + ')',
            b: [
              { n: 'Downloadables Categories', r: `/downloadable-category` },
              { n: 'Files (' + ctg.titulo + ' - ' + ctg.descripcion + ')', r: `/downloadable-category/files/${param?.id}` }]
          });
          this.getDescargables(param?.id);
        } else {
          this.router.navigate(['/downloadable-category']);
        }
      } else {
        this.router.navigate(['/downloadable-category']);
      }


    });

  }

  async getCategoriasDescargables(id) {

    return new Promise((resolve) => {
      this.utils.setLoading(true);
      this.descargablesService.findCategory({ id }).then((res: any) => {
        if (res.data.length === 1) {
          resolve(res.data[0]);
        } else {
          resolve(null);
        }
        this.utils.setLoading(false);
      }).catch(err => {
        resolve(null);
        this.utils.setLoading(false);
      });
    });

  }

  async getDescargables(idCategoriaDescargable) {
    this.utils.setLoading(true);
    this.descargablesService.findContent({ idCategoriaDescargable }).then((res: any) => {
      this.descargables = res.data;
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['fotoPresentacion', 'titulo', "descripcion", "fichero", "posicion", "habilitar", "actions"];
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

      let data: any = { idCategoriaDescargable: this.idCategoriaDescargable };

      if (id) {
        try {
          const find = from ? {} : { id };
          const reqData: any = await this.descargablesService.findContent(find);
          data = reqData.data[0];
          data.idCategoriaDescargable = this.idCategoriaDescargable;
          data.from = from;
        } catch (err) {
          this.utils.fnMainDialog("Error", "Selected file has not been found.", "message");
          return false;
        }
      }

      const dForm = this.dialog.open(FormDescargablesComponent, {
        width: '90%',
        maxWidth: '720px',
        data: { data },
        autoFocus: false,
        disableClose: true
      });

      dForm.componentInstance.dialogEvent.subscribe((result) => {
        this.dialog.closeAll();
        this.utils.fnSuccessSave();
        this.getDescargables(this.idCategoriaDescargable);
        resolve(true);
      });

    });

  }

}