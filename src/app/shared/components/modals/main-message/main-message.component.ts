import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-main-message',
  templateUrl: './main-message.component.html',
  styleUrls: ['./main-message.component.scss']
})
export class MainMessageComponent implements OnInit {

  public title: string;
  public message: string;
  public type: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: string, type: string }) {
    this.title = data.title;
    this.message = data.message;
    this.type = data.type;

  }

  ngOnInit(): void {
  }

}
