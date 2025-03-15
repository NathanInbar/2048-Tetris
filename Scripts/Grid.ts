import { Tile } from "./Tile.js";
import { GridIndex } from "./GridIndex.js";
import { Direction } from "./Direction.js";

export class Grid {
    rows: number;
    cols: number;
    squareSize: number;
    grid: (Tile|null)[][];

    constructor(rows:number, cols:number, squareSize:number) {
        this.rows = rows;
        this.cols = cols;
        this.squareSize = squareSize;
        this.grid = this._create(rows,cols);
    }

    _create (rows:number, cols:number): null[][] {
        return new Array(rows).fill(null).map(() => new Array(cols).fill(null));
    }

    IsOccupied(col:number, row:number): boolean {
        return this.grid[col][row] !== null;
    }

    GetTile(index:GridIndex): Tile|null {
        return this.grid[index.row][index.col];
    }

    TryShiftTile(tile:Tile, direction: Direction) : boolean {
        let idx = tile.Index();
        let dx = 0;
        let dy = 0;
        let isShiftInvalid = ():boolean => true;

        switch(direction) {
            case Direction.DOWN:
                dx = 0;
                dy = 1;
                isShiftInvalid = () => idx.row == this.rows-1 || this.IsOccupied(idx.col, idx.row + 1);
                break;
            case Direction.LEFT:
                dx = -1;
                dy = 0;
                isShiftInvalid = () => idx.col == 0 || this.IsOccupied(idx.col - 1, idx.row);
                break;
            case Direction.RIGHT:
                dx = 1;
                dy = 0;
                isShiftInvalid = () => idx.col == this.cols-1 || this.IsOccupied(idx.col + 1, idx.row);
                break;

            default:
                throw new Error("uncaught case " + direction + " for TryShiftTile");
        }

        if(isShiftInvalid())
        {
            console.log("cant shift");
            return false;
        }

        this._shiftTile(dx,dy,tile);
        
        return true;
    }

    _shiftTile(dx:number, dy:number, tile:Tile) : void {
        let idx:GridIndex = tile.gridIndex;
        //move the tile in the grid:
        this.Remove(idx.col, idx.row) //clear current pos
        let new_idx = idx.move(dx,dy);
        this.Set(new_idx.col, new_idx.row, tile);
    }

    Remove(col:number, row:number) : void {
        this.grid[col][row] = null;
    }

    Set(col:number, row:number, tile:Tile) : void {
        tile.gridIndex = new GridIndex(row,col);
        this.grid[col][row] = tile;
    }

    Cascade(tile:Tile): void {
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

    draw (ctx: CanvasRenderingContext2D): void {

        // BACKGROUND - - -
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if(col % 2 == 0)
                    ctx.fillStyle = "#ddd"; // Light gray background
                else 
                    ctx.fillStyle = "#e0e0"; // dark gray background
                
                ctx.fillRect(col * this.squareSize, row * this.squareSize, this.squareSize, this.squareSize);
            }
        }       
        // - - - 

        // Draw tiles
        for( let row = 0; row < this.rows; row++) {
            for(let col = 0; col < this.cols; col++) {
                if(this.grid[row][col] === null)
                    continue;

                this.grid[row][col]!.draw(ctx);
            }
        }
    
    }
}

