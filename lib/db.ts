import Dexie, { Table } from 'dexie'

export class OnyxmdDexie extends Dexie {
    noteHistories!: Table<NoteHistoryTable>

    constructor() {
        super('onyxmd')
        this.version(1).stores({
            noteHistories: '++id,&path,created_at,updated_at'
        })
    }
}

export const db = new OnyxmdDexie()
