import { Tile } from './Tile.js';
import { Grid } from './Grid.js';
import { GridIndex } from './GridIndex.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 420;
canvas.height = 420;

// grid options
const nRows = 7
const nCols = 7
const squareSize = 60;

let isGameOver = false;

let grid = new Grid(nRows, nCols, squareSize);

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

document.addEventListener('keydown', function(event) {
    OnKeyPressed(event.key);
});

let debugTile = new Tile(new GridIndex(0,Math.floor(nCols/2)), 0, squareSize);

function start() {
    SpawnTile(2);
    draw();
}

function update() {

    let activeIndex = activeTile.Index();
    //check if active tile hits the bottom. if so, set it and spawn a new one.
    if(activeIndex.row == nRows-1)
    {
        grid.SetTile(activeTile);
        SpawnTile()
        return;
    }

    let indexBelowActive = new GridIndex(activeIndex.row+1,activeIndex.col);
    let tileBelowActive = grid.GetTile(indexBelowActive);
    //if there is a tile below this one either combine it or set the active tile on top of it
    if(tileBelowActive !== null)
    {
        // if the value is the same as the active, combine it.
        if(tileBelowActive.value == activeTile.value) {
            tileBelowActive.value *= 2;
            SpawnTile();
            return;
        }
        
        // otherwise set on top
        grid.SetTile(activeTile);
        SpawnTile()
        return;
    }

    activeTile.Fall();

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    grid.draw(ctx);
    activeTile.draw(ctx, squareSize);

    requestAnimationFrame(draw);
}


// - - - - - - 

function SpawnTile() {

    //check if there is a tile in the center-top grid cell. if there is, game over
    let top_center = new GridIndex(0, Math.floor(nCols/2));
    if(grid.IsOccupied(top_center))
    {
        isGameOver = true;
        return;
    }

    let value = 2;

    //spawn active tile, assign it a value
    activeTile = new Tile(top_center, value, squareSize);
    
}

function OnKeyPressed(key)
{
    if(activeTile === null)
        return;

    if(key == "ArrowLeft")
        activeTile.ShiftLeft();

    if (key == "ArrowRight")
        activeTile.ShiftRight();
}

// - - - - - - 
start();
setInterval(update, 1000); // run update once per second