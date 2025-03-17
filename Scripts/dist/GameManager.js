import { Globals } from "./Globals.js";
import { Grid } from "./Grid.js";
import { Tile } from "./Tile.js";
export class GameManager {
    constructor(ctx) {
        this.isGameOver = false;
        this.activeTile = null;
        this.ctx = ctx;
        this.grid = new Grid(Globals.nCols, Globals.nRows);
        this.SpawnTile();
        this.draw();
    }
    update() {
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
            console.log("game over");
            return;
        }
        this.activeTile = new Tile(2);
        this.grid.SetTile(this.activeTile, center_col, 0);
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
    }
    draw() {
        this.ctx.clearRect(0, 0, Globals.canvasWidth, Globals.canvasHeight);
        this.grid.draw(this.ctx);
        if (this.activeTile)
            this.activeTile.draw(this.ctx);
    }
}
