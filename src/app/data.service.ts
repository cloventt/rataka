import { Injectable } from '@angular/core';
import { liveQuery, Observable } from 'dexie';
import { importDB, peakImportFile } from "dexie-export-import";

import { db, ContactLogEntry } from './db';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  hasPendingChanges: boolean = false;

  constructor() { }

  public async upsert(entry: ContactLogEntry): Promise<number> {
    if (entry.callsign == null || entry.callsign.length == 0) {
      throw new Error("You need to provide a callsign")
    }
    if (entry.timestamp == null) {
      entry.timestamp = new Date().toISOString();
    }
    entry.deleted = false;
    this.hasPendingChanges = true;
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
    return liveQuery(() => db.contactLogs
      .orderBy('id')
      .reverse()
      .filter(contactLog => contactLog.deleted != true)
      .toArray());
  }

  public search(searchTerm: { key: keyof ContactLogEntry, value: string }) {
    console.debug(`Retrieving Observable of contacts matching '${searchTerm}'`)
    return liveQuery(() => db.contactLogs
      .where(searchTerm.key)
      .startsWithIgnoreCase(searchTerm.value)
      .toArray());
  }

  public delete(id: number) {
    this.hasPendingChanges = true;
    return db.contactLogs
      .update(id, {
        deleted: true,
      })
  }

  public export() {
    return db.export({
      prettyJson: true,
    });
  }

  public import(dataBlob: string) {
    return db.import(new Blob([dataBlob]), {
      overwriteValues: true,
    });
  }

  public async migrate(dataBlob: string) {
    const remoteDbBlob = new Blob([dataBlob]);
    const importMeta = await peakImportFile(remoteDbBlob);
    if (importMeta.formatName != 'dexie' ||
      importMeta.formatVersion != 1 ||
      importMeta.data.databaseName != 'ratakaHamCallLog'
    ) {
      throw new Error("Database from gist is corrupt in some way (must be a v1 dexie dump)")
    }

    if (importMeta.data.databaseVersion != db.verno) {
      console.log(`Remote db version (${importMeta.data.databaseVersion}) does not match local db version (${db.verno}), migrating`)
      // we need to re-import the remote data to migrate
      if (confirm("Your database from Github is an older version and needs to be upgraded. Your log will be reset to match what is in Github and un-synced changes will be lost. Continue?")) {
        await db.delete();
        const tempDb = await importDB(remoteDbBlob);
        tempDb.close();
        await db.open();
        return true;
      }
    }
    return false;
  }
}
