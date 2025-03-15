import { Tile } from "./Tile.js";
import { Globals } from "./Globals.js";

export class Grid {
    width: number;
    height: number;
    tiles: (Tile|null)[][];

    constructor(width:number, height:number) {
        this.width = width;
        this.height = height;
        this.tiles = new Array(height).fill(null).map(() => new Array(width).fill(null));
    }
    
    GetTile(x:number, y:number): Tile|null {
        if (this.IsInBounds(x, y)) return this.tiles[y][x];
        return null;
    }

    IsInBounds(x:number, y:number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    CanMoveTile(tile: Tile, dx: number, dy: number): boolean {
        let newX = tile.x + dx;
        let newY = tile.y + dy;
        if (!this.IsInBounds(newX, newY)) return false;

        let targetTile = this.GetTile(newX, newY);
        return targetTile === null || targetTile.value === tile.value;
    }

    MoveTile(tile:Tile, dx:number, dy:number) {
        let newX = tile.x + dx;
        let newY = tile.y + dy;

        if (!this.CanMoveTile(tile, dx, dy)) return;

        let targetTile = this.GetTile(newX, newY);
        if (targetTile) {
            if (tile.merge(targetTile)) {
                this.tiles[tile.y][tile.x] = null;
            }
        } else {
            this.tiles[tile.y][tile.x] = null;
            tile.move(dx, dy);
            this.tiles[newY][newX] = tile;
        }
    }

    PlaceTile(tile:Tile) {
        if (!this.IsInBounds(tile.x, tile.y) || this.tiles[tile.y][tile.x]) return;
        this.tiles[tile.y][tile.x] = tile;
    }

    Collapse() {
        for (let y = this.height - 2; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                let tile = this.GetTile(x, y);
                if (tile && !tile.isPlaced) {
                    while (this.CanMoveTile(tile, 0, 1)) {
                        this.MoveTile(tile, 0, 1);
                    }
                }
            }
        }
    }

    draw (ctx: CanvasRenderingContext2D): void {

        // BACKGROUND - - -
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if(col % 2 == 0)
                    ctx.fillStyle = "#ddd"; // Light gray background
                else 
                    ctx.fillStyle = "#e0e0"; // dark gray background
                
                ctx.fillRect(col * Globals.squareSize, row * Globals.squareSize, Globals.squareSize, Globals.squareSize);
            }
        }       
        // - - - 

        // Draw tiles
        for( let row = 0; row < this.height; row++) {
            for(let col = 0; col < this.width; col++) {
                if(this.tiles[row][col] === null)
                    continue;

                this.tiles[row][col]!.draw(ctx);
            }
        }
    
    }
}

