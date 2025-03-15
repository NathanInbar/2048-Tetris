import { GameManager } from './GameManager.js';


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

const gameManager = new GameManager(ctx);

function start() {
    
    document.addEventListener('keydown', function(event) {
        gameManager.OnKeyPressed(event.key);
    });

    setInterval(update, 1000); // run update once per second
    requestAnimationFrame(drawUpdate);
}

function update() {
    gameManager.update();
    gameManager.draw();
}

function drawUpdate() {
    gameManager.draw()
    requestAnimationFrame(drawUpdate);
}

start();
