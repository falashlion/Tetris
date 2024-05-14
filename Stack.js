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
    for (let y = 0; y < 20; y++) {
      if (!this.rows[y].includes("empty")) {
        rowsToClear.push(y);
      }
    }
    for (let i = 0; i < rowsToClear.length; i++) {
      var y = rowsToClear[i];
      while (y > 1) {
        for (var x = 0; x < 10; x++) {
          this.rows[y][x] = this.rows[y - 1][x];
        }
        y--;
      }
      await this.sleep(100);
    }
    return rowsToClear.length;
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
    console.log("cells to write on the stack:", cells);
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];
      if (cell.x >= 0 && cell.x < 10 && cell.y >= 0 && cell.y < 20) {
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
