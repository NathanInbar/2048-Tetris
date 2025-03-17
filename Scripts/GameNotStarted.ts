import { Globals } from "./Globals.js";

export class GameNotStarted {
    ctx:CanvasRenderingContext2D;
    enabled:boolean = false;
    constructor(ctx:CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    draw()
    {
        if(!this.enabled)
            return;

        this.ctx.fillStyle = "#fff";
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillRect(0,0,Globals.nCols*Globals.squareSize, Globals.nRows*Globals.squareSize)
        this.ctx.globalAlpha = 1;

        this.ctx.fillStyle = "#000";
        this.ctx.fillText("<- = Move Left", (Globals.nCols*Globals.squareSize)/2, (Globals.nRows*Globals.squareSize)/2, 200);
        this.ctx.fillText("-> = Move Right", (Globals.nCols*Globals.squareSize)/2, (Globals.nRows*Globals.squareSize)/2 + 50, 200);


        this.ctx.fillStyle = "#696969";
        this.ctx.fillRect(110, 300, 200, 50);
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText("Play", 210, 325, 200);
        
    }
}