import { GridIndex } from "./GridIndex.js";

export class Tile {
    gridIndex: GridIndex;
    value: number;
    squareSize: number;
    color: string;

    constructor(gridIndex: GridIndex, value: number, squareSize: number) {
        this.gridIndex = gridIndex;
        this.value = value;
        this.squareSize = squareSize;
        this.color = this.getColor();
    }

    Index(): GridIndex {
        return this.gridIndex;
    }

    // ShiftLeft() {
    //     this.gridIndex.col--;
    // }

    // ShiftRight() {
    //     this.gridIndex.col++;
    // }

    getColor(): string {
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
    
    draw (ctx:CanvasRenderingContext2D): void {
        //draw square
        ctx.fillStyle = this.getColor();
        ctx.fillRect((this.gridIndex.col)*this.squareSize, (this.gridIndex.row)*this.squareSize, this.squareSize, this.squareSize);
    
        //draw number as text
        ctx.fillStyle = "#000";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(this.value.toString(), (this.gridIndex.col) * this.squareSize + this.squareSize / 2, this.gridIndex.row * this.squareSize + this.squareSize / 2);
    }

}