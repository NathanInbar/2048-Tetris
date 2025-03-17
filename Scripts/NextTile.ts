import { Globals } from "./Globals.js";

export class NextTile {
    ctx:CanvasRenderingContext2D;
    value:number = 0;

    constructor(ctx:CanvasRenderingContext2D) {
        this.ctx = ctx;
    }


    _getColor(): string {
        const colors : {[key:number]:string}= { 
            2: "#eee4da",
            4: "#ede0c8",
            8: "#f2b179",
            16: "#f59563",
            32: "#f67c5f",
            64: "#f65e3b",
            128: "#edcf72",
            256: "#edcc61",
            512: "#edc850",
            1024: "#edc53f",
            2048: "#edc22e"
        };
        return colors[this.value] || "#ccc"; // Default color if not in the map
    }

    draw(x:number,y:number)
    {
        
        this.ctx.fillText("Next: ",x,y,200);
     
        //draw square
        this.ctx.fillStyle = this._getColor();
        this.ctx.fillRect(x-30, y+20, Globals.squareSize, Globals.squareSize);
    
        //draw number as text
        this.ctx.fillStyle = "#000";
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        this.ctx.fillText(this.value.toString(), (x-30) + Globals.squareSize / 2, (y+20) + Globals.squareSize / 2);
    }
}