export class Grid {
    constructor(rows, cols, squareSize) {
        this.rows = rows;
        this.cols = cols;
        this.squareSize = squareSize;
        this.grid = this.create(rows, cols);
    }
    create(rows, cols) {
        return new Array(rows).fill(null).map(() => new Array(cols).fill(null));
    }
    IsOccupied(gridIndex) {
        return this.grid[gridIndex.row][gridIndex.col] !== null;
    }
    MakeFall(tile) {
        tile.gridIndex.row++;
    }
    ShiftLeft(tile) {
        let idx = tile.gridIndex;
        //check if the tile can move to the left
        if (idx.col == 0 || this.grid[idx.col - 1][idx.row] != null)
            return;
        //move the tile in the grid 
        this.grid[idx.col][idx.row] = null;
        idx.col--;
        this.grid[idx.col][idx.row] = tile;
    }
    ShiftRight(tile) {
        let idx = tile.gridIndex;
        //check if the tile can move to the left
        if (idx.col == this.cols - 1 || this.grid[idx.col + 1][idx.row] != null)
            return;
        //move the tile in the grid 
        this.grid[idx.col][idx.row] = null;
        idx.col++;
        this.grid[idx.col][idx.row] = tile;
    }
    SetTile(tile) {
        let i = tile.Index();
        this.grid[i.row][i.col] = tile;
    }
    GetTile(index) {
        return this.grid[index.row][index.col];
    }
    Cascade(tile) {
        // todo --
        /*
            check neighbors.
            if neighbor has same value
                - neighbor value *= 2
                - call Cascade(neighbor)
                - call tile.fall?
                    - issue where a tile that falls into a cascadable place doesnt know to cascade
                    - resolved if tile does cascade after falling (if fall is successful)
        */
    }
    draw(ctx) {
        // BACKGROUND - - -
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (col % 2 == 0)
                    ctx.fillStyle = "#ddd"; // Light gray background
                else
                    ctx.fillStyle = "#e0e0"; // dark gray background
                ctx.fillRect(col * this.squareSize, row * this.squareSize, this.squareSize, this.squareSize);
            }
        }
        // - - - 
        // Draw tiles
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col] === null)
                    continue;
                this.grid[row][col].draw(ctx);
            }
        }
    }
}
