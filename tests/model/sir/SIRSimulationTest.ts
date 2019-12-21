import {expect} from 'chai';
import {SIRSimulation, State} from "../../../src/model/sir/SIRSimulation";
import {CellStateChanged} from "../../../src/model/sir/Action";

describe('SIRSimulation', () => {
  let simulation: SIRSimulation;

  it('for c = 1.0 all cells should recover after one epoch', () => {
    simulation = new SIRSimulation(3, 3, 1.0);
    simulation.infectCell(0, 0);

    simulation.epoch();

    const expectedEvents = [
      new CellStateChanged(0, 0, State.Infected, State.Removed),
    ];

    expect(simulation.lastEvents()).to.be.deep.equal(expectedEvents);

    simulation.epoch();

    expect(simulation.lastEvents()).to.be.deep.equal([]);
  });

  it('for c = 0.0 all cells get infected', () => {
    simulation = new SIRSimulation(3, 3, 0.0);
    simulation.infectCell(0, 0);

    simulation.epoch();

    const expectedEvents = [
      new CellStateChanged(1, 0, State.Susceptible, State.Infected),
      new CellStateChanged(0, 1, State.Susceptible, State.Infected),
      new CellStateChanged(1, 1, State.Susceptible, State.Infected),
    ];

    expect(simulation.lastEvents()).to.be.deep.equal(expectedEvents);

    simulation.epoch();

    const expectedEvents2 = [
      new CellStateChanged(0, 2, State.Susceptible, State.Infected),
      new CellStateChanged(1, 2, State.Susceptible, State.Infected),
      new CellStateChanged(2, 0, State.Susceptible, State.Infected),
      new CellStateChanged(2, 1, State.Susceptible, State.Infected),
      new CellStateChanged(2, 2, State.Susceptible, State.Infected),
    ];

    expect(simulation.lastEvents()).to.be.deep.equal(expectedEvents2);

    simulation.epoch();

    expect(simulation.lastEvents()).to.be.deep.equal([]);
  });
});
