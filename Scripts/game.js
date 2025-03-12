import { Tile } from './Tile.js';
import { Grid } from './Grid.js';
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 420;
canvas.height = 420;

// grid options
const rows = 7
const cols = 7
const squareSize = 60;

let grid = new Grid(rows, cols, squareSize);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    grid.draw(ctx);

    let startTile = new Tile(1,1,2, squareSize);
    startTile.draw(ctx, squareSize);

    requestAnimationFrame(draw);
}

draw();