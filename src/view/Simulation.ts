import {RenderableObject} from "../engine/RenderableObject";
import {State} from "../model/sir/SIRSimulation";

class Cell {
  public x: number;
  public y: number;
  public state: State;

  constructor(x: number, y: number, state: State) {
    this.x = x;
    this.y = y;
    this.state = state;
  }
}

export class Simulation extends RenderableObject {
  private cells: Array<Array<Cell>>;
  private susceptible: Set<Cell>;
  private infected: Set<Cell>;
  private removed: Set<Cell>;
  private cellsX: number;
  private cellsY: number;
  private readonly width: number;
  private readonly height: number;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
    this.reset();
  }

  public setSize(cellsX: number, cellsY: number): void {
    this.cellsX = cellsX;
    this.cellsY = cellsY;
  }

  public reset(): void {
    this.cells = new Array<Array<Cell>>();
    this.susceptible = new Set<Cell>();
    this.infected = new Set<Cell>();
    this.removed = new Set<Cell>();

    for (let i = 0; i < this.cellsX; i++) {
      this.cells[i] = new Array<Cell>();
      for (let j = 0; j < this.cellsY; j++) {
        const cell = new Cell(i, j, State.Susceptible);
        this.cells[i][j] = cell;
        this.susceptible.add(cell);
      }
    }
  }

  public infect(x: number, y: number): void {
    this.cells[x][y].state = State.Infected;
    this.susceptible.delete(this.cells[x][y]);
    this.infected.add(this.cells[x][y]);
  }

  public remove(x: number, y: number): void {
    this.cells[x][y].state = State.Removed;
    this.infected.delete(this.cells[x][y]);
    this.removed.add(this.cells[x][y]);
  }

  protected draw(ctx: CanvasRenderingContext2D, time: number): void {
    const cellWidth = this.width / this.cellsX,
      cellHeight = this.height / this.cellsY;

    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = 'green';
    this.infected.forEach(value => {
      ctx.fillRect(value.x * cellWidth, value.y * cellHeight, cellWidth, cellHeight);
    });

    ctx.fillStyle = 'red';
    this.removed.forEach(value => {
      ctx.fillRect(value.x * cellWidth, value.y * cellHeight, cellWidth, cellHeight);
    });
  }
}
