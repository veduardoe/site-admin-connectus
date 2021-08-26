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

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit(): void {

    this.obsStateBreadcrumbs = this.utils.fnBreadcrumbsState().getBreadcrumbsState().subscribe( state => {
      this.breadcrumbs = state;
    });

  }

}
