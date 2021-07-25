import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu-interno',
  templateUrl: './menu-interno.component.html',
  styleUrls: ['./menu-interno.component.scss']
})
export class MenuInternoComponent implements OnInit {

  @Input() flex: string;
  @Input() items:any = [];
  @Output() action: EventEmitter<any> =  new EventEmitter();

  activeIndex = 0;

  constructor() { }

  ngOnInit(): void {
  }

  emitAction(valReturn, index){
    this.activeIndex = index;
    this.action.emit(valReturn);
  }

}
