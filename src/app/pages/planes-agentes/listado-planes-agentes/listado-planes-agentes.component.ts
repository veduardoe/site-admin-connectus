import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { PlanesAgentesService } from "src/app/shared/services/planes-agentes/planes-agentes.service";
import { MatDialog } from "@angular/material/dialog";
import { FormPlanesAgentesComponent } from "src/app/shared/components/modals/form-planes-agentes/form-planes-agentes.component";

@Component({
  selector: 'app-listado-planes-agentes',
  templateUrl: './listado-planes-agentes.component.html',
  styleUrls: ['./listado-planes-agentes.component.scss']
})
export class ListadoPlanesAgentesComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;

  constructor(
    public utils: UtilsService,
    private planesAgentesService: PlanesAgentesService,
    private dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Listado de Planes',
      b: [{ n: 'Listado de Planes', r: '/planes' }]
    });

    this.getPlanes();
  }

  async getPlanes() {
    this.utils.setLoading(true);
    this.planesAgentesService.find(null).then((res: any) => {
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "Se produjo un error al procesar la solicitud. Intente de nuevo más tarde.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['nombre', "precio", "comision", "acciones"];
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
        const reqData: any = await this.planesAgentesService.find({ _id: id });
        data = reqData.data[0];
      } catch (err) {
        this.utils.fnMainDialog("Error", "No se encontró el Plan seleccionado.", "message");
        return false;
      }
    }

    const dForm = this.dialog.open(FormPlanesAgentesComponent, {
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

}