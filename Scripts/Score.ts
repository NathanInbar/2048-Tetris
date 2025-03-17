
export class Score {
    ctx:CanvasRenderingContext2D;
    value:number = 0;
    constructor(ctx:CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    draw(x:number,y:number)
    {
        this.ctx.fillText("Score:",x,y, 200);
        this.ctx.fillText(this.value.toString(), x, y+50, 500);
    }
}