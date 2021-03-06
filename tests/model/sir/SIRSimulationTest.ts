import {expect} from 'chai';
import {SIRSimulation, State} from "../../../src/model/sir/SIRSimulation";
import {CellStateChanged} from "../../../src/model/sir/Action";

describe('SIRSimulation', () => {
  let simulation: SIRSimulation;

  it('for c = 1.0 all cells should recover after one epoch', () => {
    // given
    simulation = new SIRSimulation(3, 3, 1.0);
    simulation.infectCell(0, 0);

    // when
    simulation.epoch();

    // then
    const expectedEvents = [
      new CellStateChanged(0, 0, State.Infected, State.Removed),
    ];

    expect(simulation.lastEvents()).to.be.deep.equal(expectedEvents);
    expect(simulation.infectedCellsCount()).to.be.equal(0);
    expect(simulation.removedCellsCount()).to.be.equal(1);
    expect(simulation.susceptibleCellsCount()).to.be.equal(8);

    // and when
    simulation.epoch();

    // then
    expect(simulation.lastEvents()).to.be.deep.equal([]);
  });

  it('for c = 0.0 one random neighbour cell gets infected', () => {
    // given
    simulation = new SIRSimulation(3, 3, 0.0);
    simulation.infectCell(0, 0);

    // when
    simulation.epoch();

    // then
    const expectedEvents = [
      new CellStateChanged(1, 0, State.Susceptible, State.Infected),
      new CellStateChanged(0, 1, State.Susceptible, State.Infected),
      new CellStateChanged(1, 1, State.Susceptible, State.Infected),
    ];

    expect(expectedEvents).to.deep.include(simulation.lastEvents().pop());

    // and when
    simulation.epoch();

    // then
    const expectedEvents2 = [
      undefined,
      new CellStateChanged(1, 0, State.Susceptible, State.Infected),
      new CellStateChanged(0, 1, State.Susceptible, State.Infected),
      new CellStateChanged(1, 1, State.Susceptible, State.Infected),
      new CellStateChanged(0, 2, State.Susceptible, State.Infected),
      new CellStateChanged(1, 2, State.Susceptible, State.Infected),
      new CellStateChanged(2, 0, State.Susceptible, State.Infected),
      new CellStateChanged(2, 1, State.Susceptible, State.Infected),
      new CellStateChanged(2, 2, State.Susceptible, State.Infected),
    ];

    expect(expectedEvents2).to.deep.include(simulation.lastEvents().pop());
  });
});
