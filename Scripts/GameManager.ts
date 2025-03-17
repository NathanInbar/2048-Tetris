import { Globals } from "./Globals.js";
import { Grid } from "./Grid.js";
import { Tile } from "./Tile.js";
import { TileFallResult } from "./Grid.js";

export class GameManager {

    grid:Grid;
    isGameOver:boolean = false;
    activeTile:Tile|null = null;
    ctx:CanvasRenderingContext2D;

    constructor(ctx:CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.grid = new Grid(Globals.nCols, Globals.nRows);
        this.SpawnTile();
        this.draw();
    }

    update() {

        if (this.isGameOver) return;
        if (!this.activeTile) return;

        let fallResult:TileFallResult = this.grid.MoveTile(this.activeTile, 0, 1);
        if(fallResult == TileFallResult.BLOCKED || fallResult == TileFallResult.MERGED)
            this.SpawnTile();

        this.draw();
    }

    SpawnTile() {
        let center_col = Math.floor(this.grid.width / 2);
        if (this.grid.GetTile(center_col, 0)) {
            this.isGameOver = true;
            console.log("game over");
            return;
        }
        this.activeTile = new Tile(2);
        this.grid.SetTile(this.activeTile, center_col, 0);
        // console.log("spawned new tile");

    }

    OnKeyPressed(key:string)
    {
        if(this.isGameOver)
            return;
        if(this.activeTile === null)
            return;
    
        if(key == "ArrowLeft")
        {
            if(this.activeTile.x==0)
                return;
            let moveResult = this.grid.MoveTile(this.activeTile, -1, 0);
            if(moveResult == TileFallResult.BLOCKED || moveResult == TileFallResult.MERGED)
                this.SpawnTile();
            
        }
    
        if (key == "ArrowRight")
            {
                if(this.activeTile.x==Globals.nCols-1)
                    return;
                let moveResult = this.grid.MoveTile(this.activeTile, 1, 0);
                if(moveResult == TileFallResult.BLOCKED || moveResult == TileFallResult.MERGED)
                    this.SpawnTile();
            }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, Globals.canvasWidth, Globals.canvasHeight);

        this.grid.draw(this.ctx);
        
        if(this.activeTile)
            this.activeTile.draw(this.ctx);
    
    }
}