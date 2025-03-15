import { GridIndex } from "./GridIndex.js";
import { Direction } from "./Direction.js";
import { TileShiftResult } from "./TileShiftResult.js";
export class Grid {
    constructor(rows, cols, squareSize) {
        this.rows = rows;
        this.cols = cols;
        this.squareSize = squareSize;
        this.grid = this._create(rows, cols);
    }
    _create(rows, cols) {
        return new Array(rows).fill(null).map(() => new Array(cols).fill(null));
    }
    IsOccupied(col, row) {
        return this.grid[col][row] !== null;
    }
    GetTile(index) {
        return this.grid[index.row][index.col];
    }
    TryShiftTile(tile, direction) {
        let idx = tile.Index();
        let dx = 0;
        let dy = 0;
        let isOutOfBounds = () => true;
        switch (direction) {
            case Direction.DOWN:
                dx = 0;
                dy = 1;
                isOutOfBounds = () => idx.row == this.rows - 1;
                break;
            case Direction.LEFT:
                dx = -1;
                dy = 0;
                isOutOfBounds = () => idx.col == 0;
                break;
            case Direction.RIGHT:
                dx = 1;
                dy = 0;
                isOutOfBounds = () => idx.col == this.cols - 1;
                break;
            default:
                throw new Error("uncaught case " + direction + " for TryShiftTile");
        }
        //check if shifting the tile would put it out of bounds
        if (isOutOfBounds())
        {
            this.Set(idx.col, idx.row, tile);
            return TileShiftResult.FAIL_OUTOFBOUNDS;
        }

        let occupancyIndex = new GridIndex(idx.row + dy, idx.col + dx);
        let occupantTile = this.GetTile(occupancyIndex);
        //check if shifting the tile would intersect with another tile. 
        if (occupantTile !== null) {
            console.log("desired tile is occupied")
            //if so, and values are the same, merge
            if (!this.isMergable(tile, occupantTile))
                return TileShiftResult.FAIL_OCCUPIED;
            //otherwise, we cant shift there
            this.Merge(tile, occupantTile);
            return TileShiftResult.SUCCESS_MERGED;
        }
        console.log("shifting " + dx + "," + dy);
        //spot was open, so shift to it
        this._shiftTile(dx, dy, tile);
        return TileShiftResult.SUCCESS_SHIFTED;
    }
    isMergable(a, b) {
        if (a.value == b.value)
            return true;
        return false;
    }
    isMergableToIndex(from, to) {
        let toTile = this.GetTile(to);
        if (toTile === null)
            return false;
        return this.isMergable(from, toTile);
    }
    Merge(from, to) {
        // old tile is removed
        let old_idx = from.Index();
        this.Remove(old_idx.col, old_idx.row);
        // new value gets doubled
        to.value *= 2;
        // conditional chain reaction
        this.Cascade(to);
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
        let idx = tile.Index();
        const neighbors = [
            new GridIndex(idx.row + 1, idx.col),
            new GridIndex(idx.row, idx.col - 1),
            new GridIndex(idx.row, idx.col + 1),
            new GridIndex(idx.row - 1, idx.col) // up
        ];
        neighbors.forEach(neighbor_idx => {
            if (this.isMergableToIndex(tile, neighbor_idx)) {
                let neighborTile = this.GetTile(neighbor_idx);
                if (neighborTile !== null)
                    this.Merge(tile, neighborTile);
                return;
            }
        });
    }
    _shiftTile(dx, dy, tile) {
        let idx = tile.gridIndex;
        let new_idx = idx.move(dx, dy);
        if (this.IsOccupied(new_idx.col, new_idx.row))
            throw new Error("tried to shift to occupied position: " + idx.col + ", " + idx.row);
        //move the tile in the grid:
        this.Remove(idx.col, idx.row); //clear current pos
        this.Set(new_idx.col, new_idx.row, tile);
    }
    Remove(col, row) {
        this.grid[col][row] = null;
        console.log("Rm tile at " + col + ", " + row);
    }
    Set(col, row, tile) {
        tile.gridIndex = new GridIndex(row, col);
        this.grid[col][row] = tile;
        console.log("Set tile at " + col + ", " + row);
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
