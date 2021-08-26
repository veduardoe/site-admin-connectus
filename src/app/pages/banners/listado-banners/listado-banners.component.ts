import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormBannersComponent } from "src/app/shared/components/modals/form-banners/form-banners.component";
import { BannersService } from "src/app/shared/services/banners.service";
import { PerfilService } from "src/app/shared/services/common/perfil.service";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { UsuariosService } from "src/app/shared/services/usuarios.service";
import { ENV } from "src/environments/environment";

@Component({
  selector: 'app-listado-banners',
  templateUrl: './listado-banners.component.html',
  styleUrls: ['./listado-banners.component.scss']
})
export class ListadoBannersComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  routeImagen = ENV.FICHEROS;
  banners = [];

  banner;
  idioma;

  constructor(
    public utils: UtilsService,
    private bannerService: BannersService,
    private dialog: MatDialog

  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Listado de Banners',
      b: [{ n: 'Listado de Banners', r: '/banners' }]
    });

    this.getBanners();
  }

  async getBanners() {
    this.utils.setLoading(true);
    
    const filter: any = {};
    
    if (this.idioma) {
      filter.idioma = this.idioma;
    }

    if (this.banner) {
      filter.tipo = this.banner;
    }

    this.bannerService.find(filter).then((res: any) => {
      this.banners = res.data;
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['imagen', 'titulo', "tituloResaltado", "url", "tipo", "idioma", "posicion", "habilitado", "acciones"];
    this.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.length = this.dataSource.filteredData.length;
  }

  async openForm(id = null) {
    await this.openFormBanner(id);
    this.getBanners();
  }

  openFormBanner(id: string = null, from = null) {

    return new Promise(async (resolve, reject) => {

      let data = null;

      if (id) {
        try {
          const req = from ? this.bannerService.find({}) : this.bannerService.find({ _id: id });
          const reqData: any = await req;
          data = reqData.data[0];
          data.from = from;
        } catch (err) {
          this.utils.fnMainDialog("Error", "No se encontró el Banner seleccionado.", "message");
          return false;
        }
      }

      const dForm = this.dialog.open(FormBannersComponent, {
        width: '90%',
        maxWidth: '720px',
        data: { data },
        autoFocus: false,
        disableClose: true
      });

      dForm.componentInstance.dialogEvent.subscribe((result) => {
        this.dialog.closeAll();
        this.utils.fnSuccessSave();
        resolve(true);
      });

    });

  }

  borrar(id){
    this.utils.fnMainDialog('Confirmación', '¿Está seguro de eliminar el banner?', 'confirm').subscribe( async res => {
      if(res){
        await this.bannerService.delete(id);
        this.getBanners();
        this.utils.fnMainDialog("Notificación", "Banner eliminado correctamente.", "message");
      }
    });

  }


}