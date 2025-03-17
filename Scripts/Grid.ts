import { Tile } from "./Tile.js";
import { Globals } from "./Globals.js";

export const enum TileFallResult {
    MOVED = 1, // successfully fell
    MERGED = 2, // reached another tile that it can merge with
    BLOCKED = 3 // cant fall anymore
}

export class Grid {
    width: number;
    height: number;
    tiles: (Tile|null)[][];
    OnMergeCallback : Function;

    constructor(OnMergeCallback:Function) {
        this.width = Globals.nCols;
        this.height = Globals.nRows;
        this.OnMergeCallback = OnMergeCallback;
        this.tiles = new Array(this.height).fill(null).map(() => new Array(this.width).fill(null));
    }
    
    GetTile(x:number, y:number): Tile|null{
        return this.tiles[y][x];
    }       
    
    SetTile(tile:Tile, x:number, y:number) : void {
        if(!this.IsInBounds(x,y))
            throw Error(`cannot place tile at ${x},${y} -- out of bounds`);
        if (this.IsOccupied(x,y))
            throw Error(`cannot place tile at ${x},${y} -- spot occupied`);

        //if tile had a previous position in the grid 
        if(tile.x != null && tile.y != null)
            this.tiles[tile.y][tile.x] = null; //clear it

        tile.x = x;
        tile.y = y;
        this.tiles[y][x] = tile;

    }

    IsInBounds(x:number, y:number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    IsOccupied(x:number, y:number) : boolean {
        return this.tiles[y][x] !== null;
    }

    MoveTile(tile:Tile, dx:number, dy:number) : TileFallResult {
        if(tile.x === null || tile.y === null)
            throw Error("tile has not been set on grid yet");

        let new_x = tile.x+dx;
        let new_y = tile.y+dy;

        if(!this.IsInBounds(new_x, new_y))
        {
            this.Cascade(tile);
            return TileFallResult.BLOCKED;
        }
        if(this.IsOccupied(new_x, new_y))
        {
            if(this.CanMerge(tile, new_x, new_y))
            {
                this.MergeTiles(tile, this.GetTile(new_x, new_y)!);
                return TileFallResult.MERGED; // merge tiles together
            }
            return TileFallResult.BLOCKED;
        }

        // move tile 
        this.SetTile(tile, new_x, new_y);
        return TileFallResult.MOVED;
    }

    MergeTiles(old_tile:Tile, new_tile:Tile) : void {
        if(old_tile.x === null || old_tile.y === null)
            throw Error("tile has not been set on grid yet");


        this.OnMergeCallback(old_tile,new_tile);
        new_tile.value *= 2;


        // remove old tile
        this.tiles[old_tile.y][old_tile.x] = null;
        
        // try to make any tiles fall after merging
    
        // cascade around new_tile to see if we can merge again, chain reaction
        this.Cascade(new_tile);
    }

    Cascade(center_tile:Tile) : void {
        if(center_tile.x === null || center_tile.y === null)
            throw Error("tile has not been set on grid yet");

        //check if we can merge center with Down / Left / Right / Up neighbors

        if(this.CanMerge(center_tile, center_tile.x, center_tile.y+1)) //down
        {
            this.MergeTiles(center_tile, this.GetTile(center_tile.x, center_tile.y+1)!);   
            return;
        }            
        else if(this.CanMerge(center_tile, center_tile.x-1, center_tile.y)) //left
        {
            this.MergeTiles(center_tile, this.GetTile(center_tile.x-1, center_tile.y)!);
            return;
        }
        else if(this.CanMerge(center_tile, center_tile.x+1, center_tile.y)) //right
        {
            this.MergeTiles(center_tile, this.GetTile(center_tile.x+1,center_tile.y)!);
            return;
        }
        else if(this.CanMerge(center_tile, center_tile.x, center_tile.y-1))//up
        {
            this.MergeTiles(center_tile, this.GetTile(center_tile.x, center_tile.y+1)!);
        }
        
        //cascade is finished
    }

    CanMerge(a:Tile, new_x:number, new_y:number) : boolean {
        return this.IsInBounds(new_x, new_y) && this.IsOccupied(new_x,new_y) && (this.GetTile(new_x,new_y)!.value == a.value);
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

