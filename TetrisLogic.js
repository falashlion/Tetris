import Cell from "./Cell.js";
import Stack from "./Stack.js";
import Tetromino from "./Tetromino.js";
import {
  PAUSE_MESSAGES,
  LEVEL_TO_TICK_TIME,
  SCORE_COMMENT,
} from "./constants.js";

export default class TetrisLogic {
  constructor(canvas, ctx, cellSize) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.cellSize = cellSize;
    this.lines = 0;
    this.score = 0;
    this.level = 0;
    this.paused = false;
    this.isOver = false;
    this.tickTime = 887;
    this.stack = new Stack();
    var firstTetromino = new Tetromino();
    firstTetromino.putInGame();
    this.tetromino = firstTetromino;
    this.nextTetromino = new Tetromino();
    this.onPause = false;
    if (typeof this.gameOver === "function") {
      this.gameOver = this.gameOver.bind(this);
    }
    this.isOver = false;
    this.clearingRows = false;
    this.startAsyncTicker();
  }

  async startAsyncTicker() {
    this.ticker = await window.setInterval(() => this.tick(), this.tickTime);
  }

  async pause() {
    if (this.isOver) return;

    if (!this.onPause) {
      this.onPause = true;
      clearInterval(this.ticker);
      var message =
        PAUSE_MESSAGES[Math.floor(Math.random() * PAUSE_MESSAGES.length)];
      this.displayMessage("PAUSE", message, "", "(press Esc or F1 to unpause)");
    } else {
      this.onPause = false;
      this.ctx.clearRect(
        this.cellSize * 2.6,
        this.cellSize * 6.5,
        this.cellSize * 15,
        this.cellSize * 7
      );
      this.draw();
      this.ticker = window.setInterval(() => this.tick(), this.tickTime);
    }
  }

  tick() {
    if (this.clearingRows) {
      return;
    }
    this.move("down");
  }

  move(direction) {
    if (!this.isOver && !this.onPause) {
      this.tetromino.move(direction);
      if (this.collisionOccurs() && direction === "down") {
        this.tetromino.reverseMove(direction);
        this.lockTetromino();
      } else if (this.collisionOccurs()) {
        this.tetromino.reverseMove(direction);
      } else {
        this.draw();
      }
    }
  }

  async sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async hardDrop() {
    if (!this.isOver && !this.onPause) {
      console.log("hard drop");
      while (true) {
        this.tetromino.move("down");
        if (this.collisionOccurs()) {
          this.tetromino.reverseMove("down");
          this.lockTetromino();
          this.draw();
          return;
        }
        this.draw();
        await this.sleep(10);
      }
    }
  }

  gameOver() {
    this.isOver = true;
    console.log("Game over");
    clearInterval(this.ticker);
 
    var comment;
    for (var i = 0; i < SCORE_COMMENT.length; i++) {
      if (this.score < SCORE_COMMENT[i].score) {
        comment = SCORE_COMMENT[i].comment;
        break;
      }
    }
    this.displayMessage(
      "GAME OVER",
      "You have lost",
      "Your score was: " + this.score,
      comment
    );
  }

  async lockTetromino() {
    console.log(this.stack.overflows);
    let cellToAdd = this.tetromino.cells.map((cell) => ({
      x: cell.x,
      y: cell.y,
      color: cell.color,
    }));

    this.stack.addCells(cellToAdd);
    this.clearingRows = true;
    var rowsCleared = await this.stack.clearFullRows();
    console.log(rowsCleared);
    this.clearingRows = false;
    this.updateScore(rowsCleared);

    if (!this.stack.overflows()) {
      this.newTetromino();
      this.draw();
    } else {
      this.isOver = true;
      this.gameOver();
    }
  }
  newTetromino() {
    this.tetromino = this.nextTetromino;
    this.tetromino.putInGame();
    this.nextTetromino = new Tetromino();
    this.draw();
  }

  updateScore(rows) {
    this.lines = rows;
    switch (rows) {
      case 1:
        this.score += 40 * (this.level + 1);
        break;
      case 2:
        this.score += 100 * (this.level + 1);
        break;
      case 3:
        this.score += 300 * (this.level + 1);
        break;
      case 4:
        this.score += 1200 * (this.level + 1);
        break;
    }
    this.level = Math.floor(this.lines / 10);
    this.tickTime = LEVEL_TO_TICK_TIME[this.level];

    clearInterval(this.ticker);
    this.ticker = window.setInterval(() => this.tick(), this.tickTime);
  }

  collisionOccurs() {
    for (var i = 0; i < 4; i++) {
      var xPosition = Math.round(this.tetromino.cells[i].x);
      var yPosition = Math.round(this.tetromino.cells[i].y);
      if (xPosition < 0 || xPosition > 9) {
        // console.log("collision with wall");
        return true;
      }

      if (yPosition > 19) {
        // console.log("collision with floor");
        return true;
      }
      if (yPosition >= 0 && yPosition < 20) {
        if (xPosition >= 0 && xPosition < 10) {
          if (this.stack.rows[yPosition][xPosition] !== "empty") {
            // console.log("collision with the stack");
            return true;
          }
        }
      }
    }
    return false;
  }

  displayMessage(mainMessage, comment, secondComment, typeInstruction) {
    // console.log(mainMessage, comment, secondComment, typeInstruction);
    this.ctx.save();
    this.ctx.fillStyle = "darkslateblue";
    this.ctx.fillRect(
      this.cellSize * 2.6,
      this.cellSize * 6.5,
      this.cellSize * 14,
      this.cellSize * 7
    );

    this.ctx.font = "30px monospace";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(
      mainMessage,
      this.canvas.width / 2,
      this.canvas.height / 2 - 40
    );
    this.ctx.font = "15px monospace";

    this.ctx.fillText(comment, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.fillText(
      secondComment,
      this.canvas.width / 2,
      this.canvas.height / 2 + 30
    );
    this.ctx.font = "13px monospace";
    this.ctx.fillText(
      typeInstruction,
      this.canvas.width / 2,
      this.canvas.height / 2 + 60
    );

    this.ctx.restore();
  }

  restart() {
    if (this.isOver) {
      this.lines = 0;
      this.score = 0;
      this.level = 0;
      this.paused = false;
      this.isOver = false;
      this.tickTime = 887;
      this.stack = new Stack();
      var firstTetromino = new Tetromino();
      firstTetromino.putInGame();
      this.tetromino = firstTetromino;
      this.nextTetromino = new Tetromino();
      this.onPause = false;
      this.isOver = false;
      this.ticker = window.setInterval(() => this.tick(), this.tickTime);
      this.ctx.clearRect(
        this.cellSize * 2.6,
        this.cellSize * 6.5,
        this.cellSize * 15,
        this.cellSize * 7
      );
      this.draw();
    }
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.clearRect(0, 0,20 * this.cellSize, 40 * this.cellSize );
    this.ctx.font = "18px monospace";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("NEXT", 15 * this.cellSize, 1 * this.cellSize);
    this.nextTetromino.draw(this.ctx, this.cellSize);
    
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "white";
    
    this.ctx.fillText(
      "LEVEL: " + this.level,
      15 * this.cellSize,
      12 * this.cellSize
    );
    this.ctx.font = "30px monospace";
    this.ctx.fillText(
      "SCORE:" + this.score,
      15 * this.cellSize,
      14 * this.cellSize
    );
    this.ctx.font = "15px monospace";
    this.ctx.fillText(
      "Press [SPACE] for hardDrop",
      15 * this.cellSize,
      16 * this.cellSize
    );
    this.ctx.fillText(
      "Press [Esc or F1] to pause",
      15 * this.cellSize,
      17 * this.cellSize
    );
    
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, 10 * this.cellSize, 20 * this.cellSize);
    
    this.stack.drawStack(this.ctx, this.cellSize);

    this.tetromino.draw(this.ctx, this.cellSize);

    this.ctx.restore();
  }

  onUpdate(time, deltaTime) {
    console.log("onUpdate");
  }
}
