import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ContactLogEntry } from '../db';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(data: NgForm): void {
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
    this.dataService
      .addEntry(newRecord)
      .then(
        () => {  // onfullfilled
          data.resetForm();
          this.router.navigate(['/']);
        },
        () => { // onrejected
          alert("Failed to store new contact");
        });
  }

}
