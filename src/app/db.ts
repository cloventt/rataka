import Dexie, { Table } from 'dexie';

export interface ContactLogEntry {
  id?: number;
  timestamp?: string;
  callsign: string;
  frequency?: string;
  mode?: string;
  power?: string;
  rstReceived?: string;
  rstSent?: string;
  notes?: string;
}

export class AppDB extends Dexie {
  contactLogs!: Table<ContactLogEntry, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      contactLogs: '++id, callsign',
    });
  }

}

export const db = new AppDB();
