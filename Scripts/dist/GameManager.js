import { Globals } from "./Globals.js";
import { Grid } from "./Grid.js";
import { Tile } from "./Tile.js";
import { GameUI } from "./GameUI.js";
export class GameManager {
    constructor(ctx) {
        this.isGameOver = false;
        this.activeTile = null;
        this.ctx = ctx;
        this.ui = new GameUI(ctx);
        this.OnMergedTiles = this.OnMergedTiles.bind(this);
        this.grid = new Grid(this.OnMergedTiles);
        this.nextTileVal = 2;
        this.SpawnTile();
        this.draw();
    }
    update() {
        if (Globals.debug)
            return;
        // this.ui.SetGameOver(true);
        if (this.isGameOver)
            return;
        if (!this.activeTile)
            return;
        let fallResult = this.grid.MoveTile(this.activeTile, 0, 1);
        if (fallResult == 3 /* BLOCKED */ || fallResult == 2 /* MERGED */)
            this.SpawnTile();
        this.draw();
    }
    SpawnTile() {
        let center_col = Math.floor(this.grid.width / 2);
        if (this.grid.GetTile(center_col, 0)) {
            this.isGameOver = true;
            this.ui.SetGameOver(true);
            console.log("game over");
            return;
        }
        this.activeTile = new Tile(this.nextTileVal);
        this.grid.SetTile(this.activeTile, center_col, 0);
        this.nextTileVal = this.GenerateNextTileValue();
        // console.log("spawned new tile");
    }
    OnKeyPressed(key) {
        if (this.isGameOver)
            return;
        if (this.activeTile === null)
            return;
        if (key == "ArrowLeft") {
            if (this.activeTile.x == 0)
                return;
            let moveResult = this.grid.MoveTile(this.activeTile, -1, 0);
            if (moveResult == 3 /* BLOCKED */ || moveResult == 2 /* MERGED */)
                this.SpawnTile();
        }
        if (key == "ArrowRight") {
            if (this.activeTile.x == Globals.nCols - 1)
                return;
            let moveResult = this.grid.MoveTile(this.activeTile, 1, 0);
            if (moveResult == 3 /* BLOCKED */ || moveResult == 2 /* MERGED */)
                this.SpawnTile();
        }
        if (key == "ArrowDown") {
            let moveResult = this.grid.MoveTile(this.activeTile, 0, 1);
            if (moveResult == 3 /* BLOCKED */ || moveResult == 2 /* MERGED */)
                this.SpawnTile();
        }
    }
    OnMouseDown(pos) {
        if (!this.isGameOver)
            return;
        //magically find if restart was pressed
        if (pos.x > 110 && pos.x < 310 && pos.y > 300 && pos.y < 350) {
            //reset the game
            this.grid = new Grid(this.OnMergedTiles);
            this.nextTileVal = 2;
            this.ui.ResetScore();
            this.ui.SetGameOver(false);
            this.isGameOver = false;
            this.nextTileVal = 2;
            this.SpawnTile();
        }
    }
    OnMergedTiles(old_tile, new_tile) {
        this.ui.AddScore(new_tile.value * 2);
    }
    GenerateNextTileValue() {
        let choices = [2, 4, 8, 16];
        let choice = choices[Math.floor(Math.random() * choices.length)];
        //update next tile ui
        this.ui.SetNextTile(choice);
        return choice;
    }
    draw() {
        this.ctx.clearRect(0, 0, Globals.canvasWidth, Globals.canvasHeight);
        this.grid.draw(this.ctx);
        if (this.activeTile)
            this.activeTile.draw(this.ctx);
        this.ui.draw();
    }
}
