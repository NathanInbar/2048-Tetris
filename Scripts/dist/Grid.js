import { Globals } from "./Globals.js";
export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = new Array(height).fill(null).map(() => new Array(width).fill(null));
    }
    GetTile(x, y) {
        return this.tiles[y][x];
    }
    SetTile(tile, x, y) {
        if (!this.IsInBounds(x, y))
            throw Error(`cannot place tile at ${x},${y} -- out of bounds`);
        if (this.IsOccupied(x, y))
            throw Error(`cannot place tile at ${x},${y} -- spot occupied`);
        //if tile had a previous position in the grid 
        if (tile.x != null && tile.y != null)
            this.tiles[tile.y][tile.x] = null; //clear it
        tile.x = x;
        tile.y = y;
        this.tiles[y][x] = tile;
    }
    IsInBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    IsOccupied(x, y) {
        return this.tiles[y][x] !== null;
    }
    MoveTile(tile, dx, dy) {
        if (tile.x === null || tile.y === null)
            throw Error("tile has not been set on grid yet");
        let new_x = tile.x + dx;
        let new_y = tile.y + dy;
        if (!this.IsInBounds(new_x, new_y)) {
            console.log("blocked-bounds");
            this.Cascade(tile);
            return 3 /* BLOCKED */;
        }
        if (this.IsOccupied(new_x, new_y)) {
            if (this.CanMerge(tile, new_x, new_y)) {
                // console.log("merge!");
                this.MergeTiles(tile, this.GetTile(new_x, new_y));
                return 2 /* MERGED */; // merge tiles together
            }
            return 3 /* BLOCKED */;
        }
        // move tile 
        this.SetTile(tile, new_x, new_y);
        return 1 /* MOVED */;
    }
    MergeTiles(old_tile, new_tile) {
        if (old_tile.x === null || old_tile.y === null)
            throw Error("tile has not been set on grid yet");
        new_tile.value *= 2;
        // remove old tile
        this.tiles[old_tile.y][old_tile.x] = null;
        // try to make any tiles fall after merging
        // cascade around new_tile to see if we can merge again, chain reaction
        this.Cascade(new_tile);
    }
    Cascade(center_tile) {
        if (center_tile.x === null || center_tile.y === null)
            throw Error("tile has not been set on grid yet");
        //check if we can merge center with Down / Left / Right / Up neighbors
        if (this.CanMerge(center_tile, center_tile.x, center_tile.y + 1)) //down
         {
            this.MergeTiles(center_tile, this.GetTile(center_tile.x, center_tile.y + 1));
            return;
        }
        else if (this.CanMerge(center_tile, center_tile.x - 1, center_tile.y)) //left
         {
            this.MergeTiles(center_tile, this.GetTile(center_tile.x - 1, center_tile.y));
            return;
        }
        else if (this.CanMerge(center_tile, center_tile.x + 1, center_tile.y)) //right
         {
            this.MergeTiles(center_tile, this.GetTile(center_tile.x + 1, center_tile.y));
            return;
        }
        else if (this.CanMerge(center_tile, center_tile.x, center_tile.y - 1)) //up
         {
            this.MergeTiles(center_tile, this.GetTile(center_tile.x, center_tile.y + 1));
        }
        //cascade is finished
    }
    CanMerge(a, new_x, new_y) {
        return this.IsInBounds(new_x, new_y) && this.IsOccupied(new_x, new_y) && (this.GetTile(new_x, new_y).value == a.value);
    }
    // CanMoveTile(tile: Tile, dx: number, dy: number): boolean {
    //     let newX = tile.x + dx;
    //     let newY = tile.y + dy;
    //     if (!this.IsInBounds(newX, newY)) return false;
    //     let targetTile = this.GetTile(newX, newY);
    //     return targetTile === null || targetTile.value === tile.value;
    // }
    // MoveTile(tile:Tile, dx:number, dy:number) {
    //     let newX = tile.x + dx;
    //     let newY = tile.y + dy;
    //     if (!this.CanMoveTile(tile, dx, dy)) return;
    //     let targetTile = this.GetTile(newX, newY);
    //     if (targetTile) {
    //         if (tile.merge(targetTile)) {
    //             this.tiles[tile.y][tile.x] = null;
    //         }
    //     } else {
    //         this.tiles[tile.y][tile.x] = null;
    //         tile.move(dx, dy);
    //         this.tiles[newY][newX] = tile;
    //     }
    // }
    // Collapse() {
    //     for (let y = this.height - 2; y >= 0; y--) {
    //         for (let x = 0; x < this.width; x++) {
    //             let tile = this.GetTile(x, y);
    //             if (tile && !tile.isPlaced) {
    //                 while (this.CanMoveTile(tile, 0, 1)) {
    //                     this.MoveTile(tile, 0, 1);
    //                 }
    //             }
    //         }
    //     }
    // }
    draw(ctx) {
        // BACKGROUND - - -
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if (col % 2 == 0)
                    ctx.fillStyle = "#ddd"; // Light gray background
                else
                    ctx.fillStyle = "#e0e0"; // dark gray background
                ctx.fillRect(col * Globals.squareSize, row * Globals.squareSize, Globals.squareSize, Globals.squareSize);
            }
        }
        // - - - 
        // Draw tiles
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if (this.tiles[row][col] === null)
                    continue;
                this.tiles[row][col].draw(ctx);
            }
        }
    }
}
