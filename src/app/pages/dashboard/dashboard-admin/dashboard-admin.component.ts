import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/shared/services/common/utils.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {

  constructor(
    private utils: UtilsService
  ) { }

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Dashboard Administrativo',
      b: [
        { n: 'Dashboard Administrativo', r: '/dashboard/admin' },
      ],
    });

  }

}
