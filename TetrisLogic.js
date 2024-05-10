import Cell from "./shapes/Cell";
import Stack from "./shapes/Stack";
import Tetrimino from "./shapes/Tetrimino";
import {
  PAUSE_MESSAGES,
  LEVEL_TO_TICK_TIME,
  SCORE_COMMENT,
} from "./shapes/constants";

export default class TetrisLogic {
  constructor(ctx, cellSize) {
    this.ctx = ctx;
    this.cellSize = cellSize;
    this.lines = 0;
    this.score = 0;
    this.level = 0;
    this.paused = false;
    this.gameOver = false;
    this.tickTime = 887;
    this.stack = new Stack();
    var firstTetrimino = new Tetrimino();
    firstTetrimino.putInGame();
    this.tetrimino = firstTetrimino;
    this.nextTetrimino = new Tetrimino();
    this.onPause = false;
    this.isOver = false;
    this.clearingRows = false;
    this.startAsyncTicker();
  }

  async startAsyncTicker() {
    this.ticker = await window.setInterval(() => {
      this.tick();
    }, this.tickTime);
  }

  async pause() {
    if (this.isOver) return;
    if (!this.onPause) {
      this.onPause = true;
      clearInterval(this.ticker);
      var message =
        PAUSE_MESSAGES[Math.floor(Math.random() * PAUSE_MESSAGES.length)];
      this.displayMessage("PAUSE", message, "", "(press p to unpause)");
    } else {
      this.onPause = false;
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
      this.tetrimino.move(direction);
      if (this.collisionOccurs() && direction === "down") {
        this.tetrimino.reverseMove(direction);
        this.lockTetromino();
      } else if (this.collisionOccurs()) {
        this.tetrimino.reverseMove(direction);
      } else {
        this.draw();
      }
    }
  }

  async sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async hardDrop(direction) {
    if (!this.isOver && !this.onPause) {
      console.log("hard drop");
      while (true) {
        this.tetrimino.move("down");
        if (this.collisionOccurs()) {
          this.tetrimino.reverseMove("down");
          this.lockTetromino();
          this.draw();
          return;
        }
        this.draw();
        await this.sleep(10);
      }
    }
  }

  async lockTetromino() {
    this.stack.addTetrimino(this.tetrimino.cells);
    this.tetrimino = this.nextTetrimino;
    this.nextTetrimino = new Tetrimino();
    if (this.collisionOccurs()) {
      this.isOver = true;
      this.displayMessage(
        "GAME OVER",
        "You have lost",
        "Your score was: " + this.score,
        "Press r to restart"
      );
      clearInterval(this.ticker);
      return;
    }
    this.clearRows();
    this.draw();
  }

  newTetrimino() {
    this.tetrimino = this.nextTetrimino;
    this.tetrimino.putInGame();
    this.nextTetrimino = new Tetrimino();
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
      var xPosition = this.tetrimino.cells[i].x;
      var yPosition = this.tetrimino.cells[i].y;
      if (xPosition < 0 || xPosition > 9) {
        console.log("collision with wall");
        return true;
      }

      if (yPosition > 19) {
        console.log("collision with floor");
        return true;
      }
      if (yPosition > 0) {
        if (this.stack.rows[yPosition][xPosition] !== "empty") {
          console.log("collision with the stack");
          return true;
        }
      }
    }
    return false;
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
      "Your score was: ${this.score} . \nPress Enter to restart\n",
      comment
    );
  }

  displayMessage(mainMessage, comment, secondComment, typeInstruction) {
    console.log(mainMessage, comment, secondComment, typeInstruction);
    this.ctx.save();
    this.ctx.fillStyle = "darkslateblue";
    this.ctx.fillRect(
      this.cellSize * 0.5,
      this.cellSize * 5.5,
      this.cellSize * 15,
      this.cellSize * 7
    );

    this.ctx.font = "30px monospace";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(mainMessage, canvas.width / 2, canvas.height / 2 - 40);
    this.ctx.font = "15px monospace";

    this.ctx.fillText(comment, canvas.width / 2, canvas.height / 2);
    this.ctx.fillText(secondComment, canvas.width / 2, canvas.height / 2 + 30);
    this.ctx.font = "13px monospace";
    this.ctx.fillText(
      typeInstruction,
      canvas.width / 2,
      canvas.height / 2 + 60
    );
    this.ctx.restore();
  }

  restart() {
    if (this.isOver) {
      this.lines = 0;
      this.score = 0;
      this.level = 0;
      this.paused = false;
      this.gameOver = false;
      this.tickTime = 887;
      this.stack = new Stack();
      var firstTetrimino = new Tetrimino();
      firstTetrimino.putInGame();
      this.tetrimino = firstTetrimino;
      this.nextTetrimino = new Tetrimino();
      this.onPause = false;
      this.isOver = false;
      this.ticker = window.setInterval(() => this.tick(), this.tickTime);
      this.draw();
    }
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(
      canvas.width - 6 * this.cellSize,
      0,
      6 * this.cellSize,
      canvas.height
    );
    this.nextTetrimino.draw(this.ctx, this.cellSize);
    this.ctx.font = "18px monospace";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "black";

    this.ctx.fillText(
      "LEVEL: ${this.level}",
      13 * this.cellSize,
      12 * this.cellSize
    );
    this.ctx.font = "30px monospace";
    this.ctx.fillText(
      "SCORE: ${this.score}",
      13 * this.cellSize,
      14 * this.cellSize
    );
    this.ctx.font = "15px monospace";
    this.ctx.fillText(
      "Press [SPACE] for hardDrop",
      13 * this.cellSize,
      16 * this.cellSize
    );
    this.ctx.fillText(
      "Press [P] to pause",
      13 * this.cellSize,
      17 * this.cellSize
    );

    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, 10 * this.cellSize, 20 * this.cellSize);

    this.stack.draw(this.ctx, this.cellSize);

    this.tetrimino.draw(this.ctx, this.cellSize);
    this.ctx.restore();
  }

  onUpdate(time, deltaTime) {
    console.log("onUpdate");
  }
}
