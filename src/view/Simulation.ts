import {RenderableObject} from "../engine/RenderableObject";
import {State} from "../model/sir/SIRSimulation";

export class Simulation extends RenderableObject {
  private cells: Array<Array<State>>;
  private cellsX: number;
  private cellsY: number;
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
  }

  public setSize(cellsX: number, cellsY: number): void {
    this.cellsX = cellsX;
    this.cellsY = cellsY;
  }

  public reset(): void {
    this.cells = new Array<Array<State>>();

    for (let i = 0; i < this.cellsX; i++) {
      this.cells[i] = new Array<State>();
      for (let j = 0; j < this.cellsY; j++) {
        this.cells[i][j] = State.Susceptible;
      }
    }
  }

  public infect(x: number, y: number): void {
    this.cells[x][y] = State.Infected;
  }

  public remove(x: number, y: number): void {
    this.cells[x][y] = State.Removed;
  }

  protected draw(ctx: CanvasRenderingContext2D, time: number): void {
    const cellWidth = this.width / this.cellsX,
      cellHeight = this.height / this.cellsY;

    for (let i = 0; i < this.cellsX; i++) {
      for (let j = 0; j < this.cellsY; j++) {
        switch (this.cells[i][j]) {
          case State.Susceptible:
            ctx.fillStyle = 'blue';
            break;
          case State.Infected:
            ctx.fillStyle = 'green';
            break;
          case State.Removed:
            ctx.fillStyle = 'red';
            break;
        }

        ctx.fillRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
      }
    }
  }
}
