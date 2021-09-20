import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormEventosComponent } from "src/app/shared/components/modals/form-eventos/form-eventos.component";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { EventosService } from "src/app/shared/services/eventos.service";
import { ENV } from "src/environments/environment";

@Component({
  selector: 'app-listado-eventos',
  templateUrl: './listado-eventos.component.html',
  styleUrls: ['./listado-eventos.component.scss']
})
export class ListadoEventosComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  routeFichero = ENV.FICHEROS;
  eventos = [];

  constructor(
    public utils: UtilsService,
    private eventosService: EventosService,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Events',
      b: [{ n: 'Events', r: '/events' }]
    });

    this.getEventos();
  }

  async getEventos() {
    this.utils.setLoading(true);
    this.eventosService.find({}).then((res: any) => {
      this.eventos = res.data;
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "There was an error. Try again later.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['foto', 'titulo', 'lugar', "fechaHora", "resaltado", "acciones"];
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
  

    return new Promise(async (resolve, reject) => {
    
      let data = null;

      if (id) {
        try {
          data = await this.eventosService.find({ id });
        } catch (err) {
          this.utils.fnMainDialog("Error", "Selected event has not been found.", "message");
          return false;
        }
      }

      const dForm = this.dialog.open(FormEventosComponent, {
        width: '90%',
        maxWidth: '720px',
        data,
        autoFocus: false,
        disableClose: true
      });
  
      dForm.componentInstance.dialogEvent.subscribe((result) => {
        this.dialog.closeAll();
        this.utils.fnSuccessSave();
        resolve(true);
        this.getEventos()
      });

  });
  }

  borrarEvento(id){
    this.utils.fnMainDialog('Confirm', 'Are you sure to delete this event? This action cannot be reverted.','confirm').subscribe( r => {
      if(r){
        this.eventosService.delete(id).then( r => {
          this.utils.fnMainDialog('Notificación', 'Event has been deleted succesfully', 'message');
          this.getEventos();
        })
      }
    })
  }
}