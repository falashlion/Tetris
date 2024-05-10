import Cell from "./Cell.js";

export default class Stack {
  constructor() {
    this.rows = [];
    for (var i = 0; i < 20; i++) {
      this.rows.push([
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
        "empty",
      ]);
    }
    this.cells = [];
  }

  async clearFullRows() {
    let rowsToClear = [];
    for (var i = 0; i < 20; i++) {
      if (!this.rows[i].includes("empty")) {
        rowsToClear.push(i);
      }
    }
    for (var x = 0; x < rowsToClear.length; x++) {
      var y = rowsToClear[x];
      while (y > 1) {
        for (var j = 0; j < 10; j++) {
          this.rows[y][j] = this.rows[y - 1][j];
        }
        y--;
      }
      await this.sleep(100);
    }
  }

  async sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  toCells() {
    this.cells = [];
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 10; j++) {
        if (this.rows[i][j] !== "empty") {
          this.cells.push(new Cell(j, i, this.rows[i][j]));
        }
      }
    }
  }

  overflows() {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 10; j++) {
        if (this.rows[i][j] !== "empty") {
          console.log("yes there is overflow");
          return true;
        }
      }
    }
    console.log("no overflow");
    return false;
  }

  addCells(cells) {
    if (!cells || cells.length === 0) {
      return;
    }
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      if (cell.y >= 0 && cell.y < this.rows.length && cell.x >= 0 && cell.x < this.rows[0].length) {
        this.rows[cell.y][cell.x] = cell.color;
      }
    }
  }

  drawStack(ctx, cellSize) {
    ctx.save();
    this.toCells();
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].draw(ctx, cellSize);
    }
    ctx.restore();
  }
}
