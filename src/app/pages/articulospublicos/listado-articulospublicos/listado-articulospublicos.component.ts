import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormArticulosPublicosComponent } from "src/app/shared/components/modals/form-articulospublicos/form-articulospublicos.component";
import { FormCategoriasDescargablesComponent } from "src/app/shared/components/modals/form-categoriasdescargables/form-categoriasdescargables.component";
import { ArticulosService } from "src/app/shared/services/articulos.service";
import { CategoriasService } from "src/app/shared/services/categorias.service";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { ENV } from "src/environments/environment";

@Component({
  selector: 'app-listado-articulospublicos',
  templateUrl: './listado-articulospublicos.component.html',
  styleUrls: ['./listado-articulospublicos.component.scss']
})
export class ListadoArticulosPublicosComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  routeStorage = ENV.STORAGE;
  pathFicheros = '/articulospublicos%2F'
  articulosPublicos = [];
  idioma = 'NA';
  categorias = [];
  categoria = 'NA';
  habilitado = 'NA';

  constructor(
    public utils: UtilsService,
    public articulosService: ArticulosService,
    public dialog: MatDialog,
    public categoriasService: CategoriasService
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Public Articles',
      b: [{ n: 'Public Articles', r: '/public-articles' }]
    });
    this.getArticulos();
    this.getCategorias();

  }

  getCategorias(){
    this.categoriasService.find({}).then((res:any) => {
      this.categorias = res.data;
    });
  }

  async getArticulos() {

    this.utils.setLoading(true);
    let filter:any = {};

    if(this.idioma && this.idioma !== 'NA'){
      filter.idioma = this.idioma;
    }

    if(this.categoria && this.categoria !== 'NA'){
      filter.idCategoria = this.categoria;
    }

    if(this.habilitado !== 'NA'){
      filter.habilitar = this.habilitado;
    }

    this.articulosService.find(filter).then((res: any) => {
      this.articulosPublicos = res.data;
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['imagenSlider', 'tituloSlider', "descripcionSlider", "idioma", "habilitar", "acciones"];
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
          const reqData: any = await this.articulosService.find(find);
          data = reqData.data[0];
          data.from = from;
        } catch (err) {
          this.utils.fnMainDialog("Error", "Selected article has not been found.", "message");
          return false;
        }
      }

      const dForm = this.dialog.open(FormArticulosPublicosComponent, {
        width: '90%',
        maxWidth: '1090px',
        data: { data },
        autoFocus: false,
        disableClose: true
      });

      dForm.componentInstance.dialogEvent.subscribe((result) => {
        this.dialog.closeAll();
        this.utils.fnSuccessSave();
        this.getArticulos();
        resolve(true);
      });

    });

  }

}