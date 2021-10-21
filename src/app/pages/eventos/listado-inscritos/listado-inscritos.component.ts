import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilsService } from "src/app/shared/services/common/utils.service";
import { EventosService } from "src/app/shared/services/eventos.service";

@Component({
  selector: 'app-listado-inscritos',
  templateUrl: './listado-inscritos.component.html',
  styleUrls: ['./listado-inscritos.component.scss']
})
export class ListadoInscritosComponent implements OnInit {

  columns: string[] = [];
  dataSource: MatTableDataSource<any>;
  length = 0;
  inscritos = [];
  idEvento = null;

  constructor(
    public utils: UtilsService,
    private eventosService: EventosService,
    public dialog: MatDialog,
    public aRouter: ActivatedRoute,
    public router: Router
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.aRouter.params.subscribe(async param => {
      if (param.idEvento) {
        this.idEvento = param.idEvento;
        const events:any = await this.eventosService.find({ id: this.idEvento });
        if(events.data.length === 1){
          this.utils.fnBreadcrumbsState().setBreadcrumbsState({
            t: 'Subscribers in Event: ' + param.nombreEvento,
            b: [
              { n: 'Events', r: '/events' }, 
              { n: 'Subscribers in Event', r: '/events/subscribers/' + this.idEvento + '/' + param.nombreEvento }
            ]});
          this.getInscritos();
        }else{
          this.router.navigate(['/events']);
        }
      } else {
        this.router.navigate(['/events']);
      }
    });


    this.getInscritos();
  }

  async getInscritos() {
    this.utils.setLoading(true);
    this.eventosService.findInscritos(this.idEvento).then((res: any) => {
      this.inscritos = res.data;
      this.setTable(res.data);
      this.utils.setLoading(false);
    }).catch(err => {
      this.utils.fnMainDialog('Error', "There was an error. Try again later.", "message");
      this.setTable([]);
      this.utils.setLoading(false);
    });
  }

  setTable(data) {
    this.columns = ['nombre', 'correo', "fechaHora", "acciones"];
    this.length = data.length;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  setFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.length = this.dataSource.filteredData.length;
  }


  borrarInscrito(id) {
    this.utils.fnMainDialog('Confirm', 'Are you sure to remove this subscriber? This action cannot be reverted.', 'confirm').subscribe(r => {
      if (r) {
        this.eventosService.deleteInscrito(id).then(s => {
          this.utils.fnMainDialog('Notification', 'User has been removed succesfully', 'message');
          this.getInscritos();
        });
      }
    })
  }
}