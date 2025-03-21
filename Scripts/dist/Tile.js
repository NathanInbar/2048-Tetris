import { Globals } from "./Globals.js";
export class Tile {
    constructor(value) {
        this.x = null;
        this.y = null;
        this.value = value;
    }
    _getColor() {
        const colors = {
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
    draw(ctx) {
        if (this.x === null || this.y === null)
            return;
        //draw square
        ctx.fillStyle = this._getColor();
        ctx.fillRect((this.x) * Globals.squareSize, (this.y) * Globals.squareSize, Globals.squareSize, Globals.squareSize);
        //draw number as text
        ctx.fillStyle = "#000";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.value.toString(), (this.x) * Globals.squareSize + Globals.squareSize / 2, this.y * Globals.squareSize + Globals.squareSize / 2);
    }
}
