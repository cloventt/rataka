import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';
import { ContactLogEntry } from '../db';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  onSubmit(data: any): void {
    console.debug(data);
    const newRecord: ContactLogEntry = {
      timestamp: new Date().toISOString(),
      callsign: data.value.callsign,
      frequency: data.value.frequency,
      mode: data.value.mode,
      power: data.value.power,
      rstReceived: data.value.txr + data.value.txs,
      rstSent: data.value.rxr + data.value.rxs,
      notes: data.value.notes,
    }
    console.debug(newRecord);
    this.dataService.addEntry(newRecord);
  }

}
