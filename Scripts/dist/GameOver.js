import { Globals } from "./Globals.js";
export class GameOver {
    constructor(ctx) {
        this.enabled = false;
        this.ctx = ctx;
    }
    draw() {
        if (!this.enabled)
            return;
        this.ctx.fillStyle = "#fff";
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillRect(0, 0, Globals.nCols * Globals.squareSize, Globals.nRows * Globals.squareSize);
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = "#000";
        this.ctx.fillText("Game Over", (Globals.nCols * Globals.squareSize) / 2, (Globals.nRows * Globals.squareSize) / 2, 200);
        this.ctx.fillStyle = "#696969";
        this.ctx.fillRect(110, 300, 200, 50);
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText("Restart", 210, 325, 200);
    }
}
