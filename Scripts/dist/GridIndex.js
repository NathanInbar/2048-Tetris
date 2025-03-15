export class GridIndex {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    move(dx, dy) {
        return new GridIndex(this.row + dy, this.col + dx);
    }
}
