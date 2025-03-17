export class Score {
    constructor(ctx) {
        this.value = 0;
        this.ctx = ctx;
    }
    draw(x, y) {
        this.ctx.fillText("Score:", x, y, 200);
        this.ctx.fillText(this.value.toString(), x, y + 50, 500);
    }
}
