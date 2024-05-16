import TetrisLogic from "./TetrisLogic.js";

var cellSize = 32;

const canvas = document.getElementById("tetris");
console.log(canvas);

canvas.width = 20 * cellSize;
canvas.height = 20 * cellSize;

var ctx = canvas.getContext("2d");

var tetris = new TetrisLogic(canvas, ctx, cellSize);

var lastTime = 0;

// function updateGame(time) {
//   tetris.onUpdate(time, time - lastTime);
// }

// window.requestAnimationFrame(updateGame);

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
      tetris.move("clockwise");
      break;
    case "x":
      tetris.move("clockwise");
      break;
    case "Escape":
      tetris.pause();
      break;
    case "F1":
      Event.preventDefault();
      tetris.pause();
      break;
    case " ":
      tetris.hardDrop();
      break;
    case "r":
      tetris.restart();
      break;
    case "Enter":
      tetris.restart();
      break;
    case "Z":
      tetris.move("counterclockwise");
      break;
    case "ctrlKey":
      tetris.move("counterclockwise");
      break;
    case "Shift":
      tetris.move("hold");
      break;
    case "c":
      tetris.move("hold");
      break;
    // numbers
    case "1":
      tetris.move("clockwise");
      break;
    case "5":
      tetris.move("clockwise");
      break;
    case "9":
      tetris.move("clockwise");
      break;
    case "3":
      tetris.move("counterclockwise");
      break;
    case "7":
      tetris.move("counterclockwise");
      break;
    case "8":
      tetris.hardDrop();
      break;
    case "4":
      tetris.move("left");
      break;
    case "6":
      tetris.move("right");
      break;
    case "2":
      tetris.move("down");
      break;
    default:
      return;
  }
};
