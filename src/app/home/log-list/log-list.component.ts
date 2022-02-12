import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'dexie';
import { DataService } from '../../data.service';
import { ContactLogEntry } from '../../db';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css']
})
export class LogListComponent implements OnInit, OnDestroy {

  contacts: ContactLogEntry[] = []

  private dataSubscription: Subscription | null = null

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataSubscription = this.dataService.getAll().subscribe(
      contacts => this.contacts = contacts
    );
  }

  public search(searchTerm: { key: keyof ContactLogEntry, value: string }) {
    this.closeExistingSubscription();
    this.dataSubscription = this.dataService.search(searchTerm).subscribe(
      contacts => this.contacts = contacts
    );
  }

  public deleteRow(id: number | undefined) {
    if (id == null) {
      console.error("Got asked to delete an entry with an undefined id");
      return;
    }
    if (confirm("Are you sure you want to delete this contact?")) {
      this.dataService.delete(id);
    }
  }

  ngOnDestroy(): void {
      this.closeExistingSubscription();
  }

  private closeExistingSubscription() {
    if (this.dataSubscription != null && !this.dataSubscription.closed) {
      this.dataSubscription.unsubscribe()
    }
  }

}
