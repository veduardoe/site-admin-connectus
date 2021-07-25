import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/shared/services/common/utils.service';

@Component({
  selector: 'app-dashboard-agentes',
  templateUrl: './dashboard-agentes.component.html',
  styleUrls: ['./dashboard-agentes.component.scss']
})
export class DashboardAgentesComponent implements OnInit {

  constructor(
    private utils: UtilsService
  ) {
   }

  ngOnInit(): void {

    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Dashboard Agentes Inmobiliarios',
      b: [
        { n: 'Dashboard Agentes Inmobiliarios', r: '/dashboard/agente' },
      ],
    });

  }

}
