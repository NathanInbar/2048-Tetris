import { Tile } from './Tile.js';
import { Grid } from './Grid.js';
import { GridIndex } from './GridIndex.js';
import { Direction } from './Direction.js';

const _canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
if(!_canvas)
    throw new Error("canvas not found");
const canvas: HTMLCanvasElement = _canvas;
const _ctx = canvas.getContext("2d");
if(!_ctx)
    throw new Error("context is null");
const ctx: CanvasRenderingContext2D = _ctx;

// Set canvas size
canvas.width = 420;
canvas.height = 420;

// grid options
const nRows = 7
const nCols = 7
const squareSize = 60;

let isGameOver = false;

let grid = new Grid(nRows, nCols, squareSize);

let activeTile:Tile|null = null;

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

// let debugTile = new Tile(new GridIndex(0,Math.floor(nCols/2)), 0, squareSize);

function start() {
    SpawnTile();
    draw();
}

function update() {

    if(isGameOver)
        return;

    // if(!activeTile)
    //     return;

    // let activeIndex = activeTile.Index();
    // //check if active tile hits the bottom. if so, set it and spawn a new one.
    // if(activeIndex.row == nRows-1)
    // {
    //     grid.SetTile(activeTile);
    //     SpawnTile()
    //     return;
    // }

    // let indexBelowActive:GridIndex = new GridIndex(activeIndex.row+1,activeIndex.col);
    // let tileBelowActive:Tile|null = grid.GetTile(indexBelowActive);

    //if there is a tile below this one either combine it or set the active tile on top of it
    // if(tileBelowActive !== null)
    // {
    //     // if the value is the same as the active, combine it.
    //     if(tileBelowActive.value == activeTile.value) {
    //         tileBelowActive.value *= 2;
    //         //start cascading tiles
    //         grid.Cascade(tileBelowActive);

    //         SpawnTile();
    //         return;
    //     }
        
    //     // otherwise set on top
    //     grid.SetTile(activeTile);
    //     SpawnTile()
    //     return;
    // }

    // grid.MakeFall(activeTile);

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    grid.draw(ctx);
    
    if(activeTile)
        activeTile.draw(ctx);

    requestAnimationFrame(draw);
}


// - - - - - - 

function SpawnTile() {

    //check if there is a tile in the center-top grid cell. if there is, game over
    let top_center = new GridIndex(0, Math.floor(nCols/2));
    if(grid.IsOccupied(top_center.col, top_center.row))
    {
        isGameOver = true;
        return;
    }

    let value = 2;

    //spawn active tile, assign it a value
    activeTile = new Tile(top_center, value, squareSize);
    
}

function OnKeyPressed(key:string)
{
    if(activeTile === null)
        return;

    if(key == "ArrowLeft")
        grid.TryShiftTile(activeTile, Direction.LEFT);

    if (key == "ArrowRight")
        grid.TryShiftTile(activeTile, Direction.RIGHT);
}

// - - - - - - 
start();
setInterval(update, 1000); // run update once per second