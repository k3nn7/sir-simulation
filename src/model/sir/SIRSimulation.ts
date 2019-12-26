import {CellStateChanged} from "./Action";

export enum State {
  Susceptible,
  Infected,
  Removed
}

export class Cell {
  public readonly x: number;
  public readonly y: number;
  private readonly neighbours: Array<Cell>;
  private state: State;

  constructor(x: number, y: number, state: State) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.neighbours = new Array<Cell>();
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

  addNeighbour(cell: Cell): void {
    this.neighbours.push(cell);
  }

  getRandomNeighbour(): Cell {
    const index = Math.floor(Math.random() * this.neighbours.length);
    return this.neighbours[index];
  }
}

export class SIRSimulation {
  private readonly width: number;
  private readonly height: number;
  private readonly c: number;
  private readonly cells: Array<Array<Cell>>;
  private eventsFromLastEpoch: Array<CellStateChanged>;
  private susceptibleCells: Set<Cell>;
  private infectedCells: Set<Cell>;
  private removedCells: Set<Cell>;

  constructor(width: number, height: number, c: number) {
    this.width = width;
    this.height = height;
    this.c = c;
    this.eventsFromLastEpoch = new Array<CellStateChanged>();
    this.cells = new Array<Array<Cell>>();
    this.susceptibleCells = new Set<Cell>();
    this.infectedCells = new Set<Cell>();
    this.removedCells = new Set<Cell>();

    this.initializeCells();
  }

  private initializeCells(): void {
    for (let i = 0; i < this.width; i++) {
      this.cells[i] = new Array<Cell>();
      for (let j = 0; j < this.height; j++) {
        const cell = new Cell(i, j, State.Susceptible);
        this.cells[i][j] = cell;
        this.susceptibleCells.add(cell);
      }
    }

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.getCellNeighbours(i, j).forEach(neighbour => {
          this.cells[i][j].addNeighbour(neighbour);
        });
      }
    }
  }

  infectCell(x: number, y: number) {
    this.cells[x][y].infect();
    this.susceptibleCells.delete(this.cells[x][y]);
    this.infectedCells.add(this.cells[x][y]);
  }

  susceptibleCellsCount(): number {
    return this.susceptibleCells.size;
  }

  infectedCellsCount(): number {
    return this.infectedCells.size;
  }

  removedCellsCount(): number {
    return this.removedCells.size;
  }

  lastEvents(): Array<CellStateChanged> {
    return this.eventsFromLastEpoch;
  }

  epoch(): void {
    this.eventsFromLastEpoch = new Array<CellStateChanged>();
    const newInfectedCells = new Set<Cell>();

    this.infectedCells.forEach(cell => {
      const x = Math.random();
      if (x < this.c) {
        cell.remove();
        this.removedCells.add(cell);
        this.lastEvents().push(new CellStateChanged(
          cell.x,
          cell.y,
          State.Infected,
          State.Removed
        ));
      } else {
        newInfectedCells.add(cell);
        const neighbour = cell.getRandomNeighbour();
        if (neighbour.isSusceptible()) {
          neighbour.infect();
          newInfectedCells.add(neighbour);
          this.susceptibleCells.delete(neighbour);
          this.lastEvents().push(new CellStateChanged(
            neighbour.x,
            neighbour.y,
            State.Susceptible,
            State.Infected
          ));
        }
      }
    });

    this.infectedCells = newInfectedCells;
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
