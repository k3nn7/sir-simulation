import {CellStateChanged} from "./Action";

export enum State {
  Susceptible,
  Infected,
  Removed
}

export class Cell {
  public readonly x: number;
  public readonly y: number;
  private state: State;

  constructor(x: number, y: number, state: State) {
    this.x = x;
    this.y = y;
    this.state = state;
  }

  infect() {
    this.state = State.Infected;
  }

  isInfected(): boolean {
    return this.state == State.Infected;
  }

  isSusceptible(): boolean {
    return this.state == State.Susceptible;
  }

  isRemoved(): boolean {
    return this.state == State.Removed;
  }
}

export class SIRSimulation {
  private readonly width: number;
  private readonly height: number;
  private readonly c: number;
  private cells: Array<Array<Cell>>;
  private eventsFromLastEpoch: Array<CellStateChanged>;

  constructor(width: number, height: number, c: number) {
    this.width = width;
    this.height = height;
    this.c = c;
    this.eventsFromLastEpoch = new Array<CellStateChanged>();
    this.cells = new Array<Array<Cell>>();

    for (let i = 0; i < width; i++) {
      this.cells[i] = new Array<Cell>();
      for (let j = 0; j < height; j++) {
        this.cells[i][j] = new Cell(i, j, State.Susceptible);
      }
    }
  }

  infectCell(x: number, y: number) {
    this.cells[x][y].infect();
  }

  susceptibleCellsCount(): number {
    let result = 0;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.cells[i][j].isSusceptible()) result++;
      }
    }

    return result;
  }

  infectedCellsCount(): number {
    let result = 0;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.cells[i][j].isInfected()) result++;
      }
    }

    return result;
  }

  removedCellsCount(): number {
    let result = 0;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.cells[i][j].isRemoved()) result++;
      }
    }

    return result;
  }

  lastEvents(): Array<CellStateChanged> {
    return this.eventsFromLastEpoch;
  }

  epoch(): void {
    this.eventsFromLastEpoch = new Array<CellStateChanged>();

    const newState = new Array<Array<Cell>>();
    for (let i = 0; i < this.width; i++) {
      newState[i] = new Array<Cell>();
      for (let j = 0; j < this.height; j++) {
        newState[i][j] = this.cells[i][j];
      }
    }

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.cells[i][j].isInfected()) {
          const x = Math.random();
          if (x < this.c) {
            newState[i][j] = new Cell(i, j, State.Removed);
            this.lastEvents().push(new CellStateChanged(
              i,
              j,
              State.Infected,
              State.Removed
            ));
          } else {
            const neighbours = this.getCellNeighbours(i, j);
            const n = neighbours[Math.floor(Math.random() * neighbours.length)];
            if (n.isSusceptible() && newState[n.x][n.y].isSusceptible()) {
              newState[n.x][n.y] = new Cell(
                n.x,
                n.y,
                State.Infected
              );

              this.lastEvents().push(new CellStateChanged(
                n.x,
                n.y,
                State.Susceptible,
                State.Infected
              ));
            }
          }
        }
      }
    }

    this.cells = newState;
  }

  private getCellNeighbours(x: number, y: number): Array<Cell> {
    const result = new Array<Cell>();

    if (x > 0) result.push(this.cells[x - 1][y]);
    if (y > 0) result.push(this.cells[x][y - 1]);
    if (x > 0 && y > 0) result.push(this.cells[x - 1][y - 1]);
    if (x > 0 && y < this.height - 1) result.push(this.cells[x - 1][y + 1]);

    if (x < this.width - 1) result.push(this.cells[x + 1][y]);
    if (y < this.height - 1) result.push(this.cells[x][y + 1]);
    if (x < this.width - 1 && y < this.height - 1) result.push(this.cells[x + 1][y + 1]);
    if (x < this.width - 1 && y > 0) result.push(this.cells[x + 1][y - 1]);

    return result;
  }
}
