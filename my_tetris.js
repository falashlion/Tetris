import TetrisLogic from "./TetrisLogic.js";

var cellSize = 32;

const canvas = document.getElementById("tetris");
// console.log(canvas);

canvas.width = 20 * cellSize;
canvas.height = 20 * cellSize;

var ctx = canvas.getContext("2d");

var tetris = new TetrisLogic(canvas, ctx, cellSize);

var lastTime = 0;

function updateGame(time) {
  tetris.onUpdate(time, time - lastTime);
}

window.requestAnimationFrame(updateGame);

document.onkeydown = (Event) => {
  switch (Event.key) {
    case "ArrowRight":
      tetris.move("right");
      break;
    case "ArrowLeft":
      tetris.move("left");
      break;
    case "ArrowDown":
      tetris.move("down");
      break;
    case "ArrowUp":
      tetris.move("turn");
      break;
    case 'p':
      tetris.pause();
      break;
    case '':
      tetris.hardDrop();
      break;
    case 'Enter':
      tetris.restart();
      break;
    default:
      return;
  }
};
