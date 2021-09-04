
interface Cursor {
    row: number
    column: number
}

export interface Delta {
    action: 'insert' | 'remove'
    start: Cursor
    end: Cursor
    lines: string[]
    id: number
}
