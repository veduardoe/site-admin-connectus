import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormImagenesPerfilesComponent } from "src/app/shared/components/modals/form-imagenesperfiles/form-imagenesperfiles.component";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { ImagenesPerfilesService } from "src/app/shared/services/imagenesperfiles.service";
import { ENV } from "src/environments/environment";

@Component({
  selector: 'app-imagenesperfiles',
  templateUrl: './imagenes-perfiles.component.html',
  styleUrls: ['./imagenes-perfiles.component.scss']
})
export class ImagenesPerfilesComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  routeStorage = ENV.STORAGE;
  pathFicheros = '/imagenesperfiles%2F'
  categorias = [];

  constructor(
    public utils: UtilsService,
    public imagenesPerfilesService: ImagenesPerfilesService,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Profile Images',
      b: [{ n: 'Profile Images ', r: '/profile-images' }]
    });
    this.getCategorias();

  }

  async getCategorias() {
    this.utils.setLoading(true);
    this.imagenesPerfilesService.find({}).then((res: any) => {
      this.categorias = res.data;
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['imagen', 'detalle', "detalleEN", "habilitado", "acciones"];
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
          const reqData: any = await this.imagenesPerfilesService.find(find);
          data = reqData.data[0];
          data.from = from;
        } catch (err) {
          this.utils.fnMainDialog("Error", "Selected image has not been found.", "message");
          return false;
        }
      }

      const dForm = this.dialog.open(FormImagenesPerfilesComponent, {
        width: '90%',
        maxWidth: '720px',
        data: { data },
        autoFocus: false,
        disableClose: true
      });

      dForm.componentInstance.dialogEvent.subscribe((result) => {
        this.dialog.closeAll();
        this.utils.fnSuccessSave();
        this.getCategorias();
        resolve(true);
      });

    });

  }

}