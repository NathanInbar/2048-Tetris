import { Globals } from "./Globals.js";
import { Grid } from "./Grid.js";
import { Tile } from "./Tile.js";
import { TileFallResult } from "./Grid.js";
import { GameUI } from "./GameUI.js";

export class GameManager {

    grid:Grid;
    isGameOver:boolean = false;
    gameNotStarted:boolean = true;
    activeTile:Tile|null = null;
    ui:GameUI;
    ctx:CanvasRenderingContext2D;
    nextTileVal:number;

    constructor(ctx:CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.ui = new GameUI(ctx);
        this.OnMergedTiles = this.OnMergedTiles.bind(this);
        this.grid = new Grid(this.OnMergedTiles);
        this.nextTileVal = 2;
        this.SpawnTile();
        this.draw();
    }

    update() {
        if (this.gameNotStarted) return;
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
            this.ui.SetGameOver(true);
            return;
        }
        this.activeTile = new Tile(this.nextTileVal);
        this.grid.SetTile(this.activeTile, center_col, 0);
        this.nextTileVal = this.GenerateNextTileValue();
        // console.log("spawned new tile");
    
    }

    OnKeyPressed(key:string)
    {
        if(this.isGameOver)
            return;
        if(this.activeTile === null)
            return;
    
        if(key == "ArrowLeft" || key == "A")
        {
            if(this.activeTile.x==0)
                return;
            let moveResult = this.grid.MoveTile(this.activeTile, -1, 0);
            if(moveResult == TileFallResult.BLOCKED || moveResult == TileFallResult.MERGED)
                this.SpawnTile();
        }
    
        if (key == "ArrowRight" || key == "D")
        {
            if(this.activeTile.x==Globals.nCols-1)
                return;
            let moveResult = this.grid.MoveTile(this.activeTile, 1, 0);
            if(moveResult == TileFallResult.BLOCKED || moveResult == TileFallResult.MERGED)
                this.SpawnTile();
        }

        if (key == "ArrowDown" || key == "S")
        {
            let moveResult = this.grid.MoveTile(this.activeTile, 0, 1);
            if(moveResult == TileFallResult.BLOCKED || moveResult == TileFallResult.MERGED)
                this.SpawnTile();
        }
    }

    OnMouseDown(pos:{x:number,y:number}) {
        if(!(this.gameNotStarted || this.isGameOver))
            return;

        //magically find if restart was pressed
        if(pos.x > 110 && pos.x < 310 && pos.y > 300 && pos.y < 350)
        {
            if(this.isGameOver)
            {
                    //reset the game
                this.grid = new Grid(this.OnMergedTiles);
                this.nextTileVal = 2;
                this.ui.ResetScore();
                this.ui.SetGameOver(false);
                this.isGameOver = false;
                this.nextTileVal = 2;
                this.SpawnTile();
            }
            else if(this.gameNotStarted)
            {
                this.gameNotStarted = false;
                this.ui.GameStarted();
            }
        }
    }

    OnMergedTiles(old_tile:Tile, new_tile:Tile) {
       this.ui.AddScore(new_tile.value*2);
    }

    GenerateNextTileValue() : number{
        let choices = [2,4,8,16];
        let choice = choices[Math.floor(Math.random()*choices.length)];

        //update next tile ui
        this.ui.SetNextTile(choice);

        return choice;
    }

    draw() {
        this.ctx.clearRect(0, 0, Globals.canvasWidth, Globals.canvasHeight);

        this.grid.draw(this.ctx);
        
        if(this.activeTile)
            this.activeTile.draw(this.ctx);
    
        this.ui.draw();
    }
}