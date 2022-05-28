import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { ContactLogEntry } from '../db';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnChanges {

  contactData?: ContactLogEntry = {
    callsign: '',
    frequency: '',
  };

  edit = false;

  @Input() latitude?: number;

  @Input() longitude?: number;

  @Input() maidenhead?: string;

  constructor(
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private locationService: LocationService
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
    } else {
      this.locationService.getLocation().then((position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.maidenhead = LocationService.toMaidenhead(this.latitude, this.longitude);
      })).catch((error) => {
        console.error('Failed to get the location from Geolocation API', error);
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.debug(changes);
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
