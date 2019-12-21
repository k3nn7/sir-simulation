import {CellStateChanged} from "./Action";

export enum State {
  Susceptible,
  Infected,
  Removed
}

export class Cell {
  private readonly _x: number;
  private readonly _y: number;
  private state: State;

  constructor(x: number, y: number, state: State) {
    this._x = x;
    this._y = y;
    this.state = state;
  }

  infect() {
    this.state = State.Infected;
  }

  remove() {
    this.state = State.Removed;
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


  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
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
    return 8;
  }

  infectedCellsCount(): number {
    return 1;
  }

  removedCellsCount(): number {
    return 0;
  }

  lastEvents(): Array<CellStateChanged> {
    return this.eventsFromLastEpoch;
  }

  epoch(): void {
    this.eventsFromLastEpoch = new Array<CellStateChanged>();

    const newState = new Array<Array<Cell>>();
    for(let i = 0; i < this.width; i++) {
      newState[i] = new Array<Cell>();
      for (let j = 0; j < this.height; j++) {
        newState[i][j] =  this.cells[i][j];
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
            this.getCellNeighbours(i, j).forEach((cell: Cell) => {
              if (cell.isSusceptible() && (newState[cell.x][cell.y].isSusceptible())) {
                newState[cell.x][cell.y] = new Cell(
                  cell.x,
                  cell.y,
                  State.Infected
                );

                this.lastEvents().push(new CellStateChanged(
                  cell.x,
                  cell.y,
                  State.Susceptible,
                  State.Infected
                ));
              }
            });
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
