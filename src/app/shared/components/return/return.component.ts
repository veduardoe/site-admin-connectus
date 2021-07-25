import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss']
})
export class ReturnComponent implements OnInit, OnChanges {

  @Input() url: string;
  @Input() text: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(){
  }

}
