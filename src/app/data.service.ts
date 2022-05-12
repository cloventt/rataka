import { Injectable } from '@angular/core';
import { liveQuery, Observable } from 'dexie';
import "dexie-export-import";

import { db, ContactLogEntry } from './db';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public async upsert(entry: ContactLogEntry): Promise<number> {
    if (entry.callsign == null || entry.callsign.length == 0) {
      throw new Error("You need to provide a callsign")
    }
    if (entry.timestamp == null) {
      entry.timestamp = new Date().toISOString();
    }
    return db.contactLogs.put(entry);
  }

  public get(id: number): Observable<ContactLogEntry | undefined> {
    return liveQuery(() => db.contactLogs
      .where('id')
      .equals(id)
      .first());
  }

  public getAll(): Observable<ContactLogEntry[]> {
    console.debug('Retrieving Observable of all contact logs')
    return liveQuery(() => db.contactLogs.orderBy('id').reverse().toArray());
  }

  public search(searchTerm: { key: keyof ContactLogEntry, value: string }) {
    console.debug(`Retrieving Observable of contacts matching '${searchTerm}'`)
    return liveQuery(() => db.contactLogs
      .where(searchTerm.key)
      .startsWithIgnoreCase(searchTerm.value)
      .toArray());
  }

  public delete(id: number) {
    return db.contactLogs.delete(id);
  }

  public export() {
    return db.export();
  }

  public import(dataBlob: string) {
    return db.import(new Blob([dataBlob]), {
      overwriteValues: true,
    });
  }
}
