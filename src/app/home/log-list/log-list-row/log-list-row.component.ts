import { Component, Input, OnInit } from '@angular/core';
import { ContactLogEntry } from '../../../db';

@Component({
  selector: 'app-log-list-row',
  templateUrl: './log-list-row.component.html',
  styleUrls: ['./log-list-row.component.css']
})
export class LogListRowComponent {

  @Input() rowData: ContactLogEntry = {callsign: ''};

  constructor() { }

}
