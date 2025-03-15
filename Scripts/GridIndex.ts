export class GridIndex {
    readonly row: number;
    readonly col: number;
    
    constructor(row:number,col:number) {
        this.row = row;
        this.col = col;
    }

    move(dx:number, dy:number): GridIndex {
        return new GridIndex(this.row + dy,this.col + dx);
    }
}