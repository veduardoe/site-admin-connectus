import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/common/utils.service';

@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss']
})
export class SubheaderComponent implements OnInit {

  public obsStateBreadcrumbs;
  public breadcrumbs;
  public indicadores;

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit(): void {

    this.obsStateBreadcrumbs = this.utils.fnBreadcrumbsState().getBreadcrumbsState().subscribe( state => {
      this.breadcrumbs = state;
    });

    this.setIndicadores();
  }

  setIndicadores(){
    this.utils.getIndicadores().then( (res:any) => {
      const { uf, dolar, dolar_intercambio, euro, utm } = res;
      this.indicadores = { uf, dolar, dolar_intercambio, euro, utm };
      localStorage.setItem('indicadores', JSON.stringify(this.indicadores));
    });
  }

}
