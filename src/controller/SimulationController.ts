import {Simulation} from "../view/Simulation";
import {SIRSimulation, State} from "../model/sir/SIRSimulation";

export class SimulationController {
  private view: Simulation;

  constructor(view: Simulation) {
    this.view = view;
  }

  public async start(): Promise<void> {
    this.view.setSize(200, 200);
    this.view.reset();
    const simulation = new SIRSimulation(200, 200, 0.17);

    for (let i = 0; i < 10; i++) {
      const x = Math.floor(Math.random() * 200),
        y = Math.floor(Math.random() * 200);
      console.log(x, y);
      simulation.infectCell(x, y);
      this.view.infect(x, y);
    }

    while (true) {
      await new Promise(r => setTimeout(r, 10));
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


    }
  }
}
