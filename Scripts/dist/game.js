import { GameManager } from './GameManager.js';
import { Globals } from './Globals.js';
const _canvas = document.getElementById("gameCanvas");
if (!_canvas)
    throw new Error("canvas not found");
const canvas = _canvas;
const _ctx = canvas.getContext("2d");
if (!_ctx)
    throw new Error("context is null");
const ctx = _ctx;
// Set canvas size
canvas.width = Globals.canvasWidth;
canvas.height = Globals.canvasHeight;
const gameManager = new GameManager(ctx);
function start() {
    document.addEventListener('keydown', function (event) {
        gameManager.OnKeyPressed(event.key);
    });
    document.addEventListener('mousedown', function (event) {
        let rect = canvas.getBoundingClientRect();
        gameManager.OnMouseDown({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    });
    setInterval(update, Globals.updateDelay); //start update loop
    requestAnimationFrame(drawUpdate);
}
function update() {
    gameManager.update();
}
function drawUpdate() {
    gameManager.draw();
    requestAnimationFrame(drawUpdate);
}
start();
