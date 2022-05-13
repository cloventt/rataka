import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { ContactLogEntry } from '../db';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  contactData?: ContactLogEntry = {
    callsign: '',
    frequency: '',
  };

  edit = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.edit = this.router.url.includes('edit');

    if (this.edit) {
      this.activatedRoute.params.subscribe(params => {
        this.dataService.get(parseInt(params['id'])).subscribe(savedData => {
          this.contactData = Object.assign({}, savedData);
        })
      })
    }
  }

  onSubmit(data: NgForm): void {
    const newRecord: ContactLogEntry = {
      id: data.value.id,
      timestamp: new Date().toISOString(),
      callsign: data.value.callsign,
      frequency: data.value.frequency,
      mode: data.value.mode,
      power: data.value.power,
      rstReceived: data.value.rstReceived,
      rstSent: data.value.rstSent,
      notes: data.value.notes,
    }
    this.dataService
      .upsert(newRecord)
      .then(
        () => {  // onfullfilled
          data.resetForm();
          this.router.navigate(['/']);
        },
        () => { // onrejected
          alert("Failed to store new contact");
        });
  }

  public delete(id: number | undefined) {
    if (id == null) {
      console.error("Got asked to delete an entry with an undefined id");
      return;
    }
    if (confirm("Are you sure you want to delete this contact?")) {
      this.dataService.delete(id);
    }
  }

}
