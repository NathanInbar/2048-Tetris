export class GridIndex {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    move(dx, dy) {
        return new GridIndex(this.col + dx, this.row + dy);
    }
}
