export class Grid {

    constructor(rows, cols, squareSize) {
        this.rows = rows;
        this.cols = cols;
        this.squareSize = squareSize;
        this.grid = [[]]
    }

    draw (ctx) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if(col % 2 == 0)
                    ctx.fillStyle = "#ddd"; // Light gray background
                else 
                    ctx.fillStyle = "#e0e0"; // dark gray background
                
                ctx.fillRect(col * this.squareSize, row * this.squareSize, this.squareSize, this.squareSize);
            }
        }       
    
    }
}