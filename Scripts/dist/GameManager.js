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
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);

    }
    update() {
        if (this.isGameOver)
            return;
        if (this.activeTile) {
            if (this.grid.CanMoveTile(this.activeTile, 0, 1)) {
                this.grid.MoveTile(this.activeTile, 0, 1);
            }
            else {
                this.activeTile.isPlaced = true;
                this.activeTile = null;
                this.grid.Collapse();
                this.SpawnTile();
            }
        }
        this.draw();
    }
    SpawnTile() {
        if (this.grid.GetTile(Math.floor(this.grid.width / 2), 0)) {
            this.isGameOver = true;
            return;
        }
        this.activeTile = new Tile(Math.floor(this.grid.width / 2), 0, 2);
        this.grid.PlaceTile(this.activeTile);
    }
    MoveActiveTile(direction) {
        if (!this.activeTile)
            return;
        let dx = direction === "left" ? -1 : 1;
        if (this.grid.CanMoveTile(this.activeTile, dx, 0)) {
            this.grid.MoveTile(this.activeTile, dx, 0);
        }
    }
    OnKeyPressed(key) {
        if (this.isGameOver)
            return;
        if (this.activeTile === null)
            return;
        if (key == "ArrowLeft")
            this.MoveActiveTile("left");
        if (key == "ArrowRight")
            this.MoveActiveTile("right");
    }

    draw() {
        this.ctx.clearRect(0, 0, Globals.canvasWidth, Globals.canvasHeight);
        this.grid.draw(this.ctx);
        if (this.activeTile)
            this.activeTile.draw(this.ctx);
    }
}
