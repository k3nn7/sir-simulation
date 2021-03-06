import {Simulation} from "../view/Simulation";
import {SIRSimulation, State} from "../model/sir/SIRSimulation";
import {Graph, Point} from "../view/Graph";

export class SimulationController {
  private view: Simulation;
  private graph: Graph;
  private horizontalCellsInput: HTMLInputElement;
  private verticalCellsInput: HTMLInputElement;
  private infectedCellsInput: HTMLInputElement;
  private cInput: HTMLInputElement;

  constructor(
    view: Simulation,
    graph: Graph,
    horizontalCellsInput: HTMLInputElement,
    verticalCellsInput: HTMLInputElement,
    infectedCellsInput: HTMLInputElement,
    cInput: HTMLInputElement,
  ) {
    this.horizontalCellsInput = horizontalCellsInput;
    this.verticalCellsInput = verticalCellsInput;
    this.infectedCellsInput = infectedCellsInput;
    this.cInput = cInput;
    this.view = view;
    this.graph = graph;
  }

  public async start(): Promise<void> {
    const hCells = parseInt(this.horizontalCellsInput.value, 10);
    const vCells = parseInt(this.verticalCellsInput.value, 10);
    const infectedCells = parseInt(this.infectedCellsInput.value, 10);
    const c = parseFloat(this.cInput.value);

    this.view.setSize(hCells, vCells);
    this.view.reset();
    this.graph.reset();
    const simulation = new SIRSimulation(hCells, vCells, c);

    for (let i = 0; i < infectedCells; i++) {
      const x = Math.floor(Math.random() * hCells),
        y = Math.floor(Math.random() * vCells);
      simulation.infectCell(x, y);
      this.view.infect(x, y);
    }

    let epoch = 0;
    while (true) {
      await new Promise(r => setTimeout(r, 100));
      simulation.epoch();

      simulation.lastEvents().forEach((event) => {
        switch (event.to) {
          case State.Infected:
            this.view.infect(event.x, event.y);
            break;
          case State.Removed:
            this.view.remove(event.x, event.y);
            break;
        }
      });

      this.graph.addSusceptiblePoint(new Point(epoch, simulation.susceptibleCellsCount()));
      this.graph.addInfectedPoint(new Point(epoch, simulation.infectedCellsCount()));
      this.graph.addRemovedPoint(new Point(epoch, simulation.removedCellsCount()));
      epoch++;
    }
  }
}
