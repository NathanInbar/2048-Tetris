export class Tile {
    constructor(x, y, value, squareSize) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.squareSize = squareSize;
        this.color = this.getColor();
    }

    getColor() {
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
    
    draw (ctx) {
        //draw square
        ctx.fillStyle = this.getColor();
        ctx.fillRect(this.x, this.y, this.squareSize, this.squareSize);
    
        //draw number as text
        ctx.fillStyle = "#000";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.value, this.x + this.squareSize / 2, this.y + this.squareSize / 2);
    }

}