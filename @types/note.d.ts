
export interface Notes {
    [key:string]: Note
}

export interface Note {
    revision: number
    data: string
}
