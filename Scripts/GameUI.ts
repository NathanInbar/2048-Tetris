import { GameOver } from "./GameOver.js";
import { Globals } from "./Globals.js";
import { NextTile } from "./NextTile.js";
import { Score } from "./Score.js";

export class GameUI {

    ctx:CanvasRenderingContext2D;
    score:Score;
    nextTile:NextTile;
    gameOver:GameOver;
    x:number;
    y:number;

    constructor(ctx:CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.score = new Score(ctx);
        this.nextTile = new NextTile(ctx);
        this.gameOver = new GameOver(ctx);

        this.x = Globals.squareSize*Globals.nCols;
        this.y = 0;
    }

    AddScore(ds:number){
        this.score.value += ds;
    }

    ResetScore(){
        this.score.value = 0;
    }

    SetNextTile(value:number) {
        this.nextTile.value = value;
    }

    SetGameOver(value:boolean) {
        this.gameOver.enabled = value;
    }

    draw()
    {
        //draw vertical divider
        this.ctx.fillStyle = "#03636";
        this.ctx.fillRect(this.x, this.y,5,Globals.canvasHeight);

        //draw the next tile indicator
        this.nextTile.draw(this.x + 90, this.y + 30);

        //draw the score
        this.score.draw(this.x + 90, this.y + Globals.canvasHeight - 100);

        //draw game over 
        this.gameOver.draw();
    }
}