import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { MatDialog } from "@angular/material/dialog";
import { ClientesService } from "src/app/shared/services/clientes/clientes.service";
import { FormClientesComponent } from "src/app/shared/components/modals/form-clientes/form-clientes.component";

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss']
})
export class ListadoClientesComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  clientes = [];

  constructor(
    public utils: UtilsService,
    private clientesService: ClientesService,
    private dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Listado de Clientes',
      b: [{ n: 'Listado de Clientes', r: '/clientes' }]
    });

    this.getPlanes();
  }

  async getPlanes() {
    this.utils.setLoading(true);
    this.clientesService.find(null).then((res: any) => {
      this.clientes = res.data;
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['nombres', "apellidos", "identificacion", "correo", "telefono", "acciones"];
    this.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.length = this.dataSource.filteredData.length;
  }

  async openForm(id: string = null) {

    let data = null;

    if (id) {
      try {
        const reqData: any = await this.clientesService.find({ _id: id });
        data = reqData.data[0];
      } catch (err) {
        this.utils.fnMainDialog("Error", "No se encontró el clientes seleccionado.", "message");
        return false;
      }
    }

    const dForm = this.dialog.open(FormClientesComponent, {
      width: '90%',
      maxWidth: '720px',
      data: { data },
      autoFocus: false,
      disableClose: true
    });

    dForm.componentInstance.dialogEvent.subscribe((result) => {
      this.dialog.closeAll();
      this.utils.fnSuccessSave();
      this.getPlanes();
    });

  }

  exportarExcel(){

    const data = [
      [
        'Nombres',
        'Apellido',
        'Identificación',
        'Email',
        'Telefono',
        'Fecha Registro',
      ],[]
    ];

    this.clientes.forEach((val, key) => {
      data.push([
        val.nombres,
        val.apellidos,
        val.tipoIdentificacion + ' ' + val.identificacion,
        val.correo,
        val.telefono,
        val.fechaRegistro
      ]);
    });

    if(this.clientes.length === 0){
      this.utils.fnMessage("No hay datos para ser exportados.");
      return;
    }
    this.utils.exportAsExcelFile(data, 'Clientes');
  }


}