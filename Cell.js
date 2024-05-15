export default class Cell {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  getCoordinates() {
    var coordinates = {};
    coordinates.x = this.x;
    coordinates.y = this.y;

    return coordinates;
  }

  draw(ctx, cellSize) {
    ctx.save();

    ctx.fillStyle = this.color;
    // Calculate the y-coordinate, adjusted to hide the top 2 rows.
    ctx.fillRect(
      this.x * cellSize,
      (this.y) * cellSize,
      cellSize,
      cellSize
    );

    ctx.restore();
  }
}
