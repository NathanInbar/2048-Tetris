import { Tile } from './Tile.js';
import { Grid } from './Grid.js';
import { GridIndex } from './GridIndex.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 420;
canvas.height = 420;

// grid options
const rows = 7
const cols = 7
const squareSize = 60;

let isGameOver = false;

let grid = new Grid(rows, cols, squareSize);

let activeTile = null;

/*
game flow:
    - on start,
        - check if there is a tile in the center-top grid cell
            - if there is, game over
            - else spawn an active tile, assign it a value
    - on update, 
        - check if tile in row++, targetTile.
            - if it does, and targetTile.value == tile.value, then targetTile.value *= 2.
                - trigger spawn of new tile
            - else move the active tile down (row ++)
    - LMB to move column left one (col ++)
    - RMB to move column right one (col --)
*/



function start() {
    trySpawnTile(grid);
}

function update() {

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    grid.draw(ctx);
    activeTile.draw(ctx, squareSize);

    requestAnimationFrame(draw);
}


// - - - - - - 

function trySpawnTile(grid) {
    /*
    - check if there is a tile in the center-top grid cell
        - if there is, game over
    - else spawn an active tile, assign it a value
    */
        let top_center = new GridIndex(0, Math.floor(cols/2));
        // check center-top grid cell
        if(grid.IsOccupied(top_center))
        {
            isGameOver = true;
            return;
        }
        
        //spawn active tile, assign it a value
        activeTile = new Tile(top_center, 2, squareSize);
    
}
// - - - - - - 

start();
setInterval(update, 1000); // run update once per second
draw();