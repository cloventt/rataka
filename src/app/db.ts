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
  deleted?: boolean;
}

export class AppDB extends Dexie {
  contactLogs!: Table<ContactLogEntry, number>;

  constructor() {
    super('ratakaHamCallLog');
    this.version(4).stores({
      contactLogs: '++id, callsign',
    }).upgrade(tx => {
      return tx.table('contactLogs').toCollection().modify(contactLog => {
        contactLog.deleted = false;
      })
    });
  }

}

export const db = new AppDB();
