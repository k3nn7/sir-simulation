import {State} from "./SIRSimulation";

export class CellStateChanged {
  private readonly _x: number;
  private readonly _y: number;
  private readonly _from: State;
  private readonly _to: State;

  constructor(x: number, y: number, from: State, to: State) {
    this._x = x;
    this._y = y;
    this._from = from;
    this._to = to;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get from(): State {
    return this._from;
  }

  get to(): State {
    return this._to;
  }
}
