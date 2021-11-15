import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/shared/services/common/utils.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.utils.fnBreadcrumbsState().setBreadcrumbsState({
      t: 'Select Menu Option',
      b: [{ n: 'Select Menu Option ', r: '/common/start' }]
    });
  }

}
