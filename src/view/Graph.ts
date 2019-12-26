import {RenderableObject} from "../engine/RenderableObject";

export class Point {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Graph extends RenderableObject {
  private minY: number;
  private maxY: number;
  private readonly width: number;
  private readonly height: number;
  private susceptible: Array<Point>;
  private infected: Array<Point>;
  private removed: Array<Point>;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
    this.resetData();
  }

  private resetData() {
    this.maxY = Number.NEGATIVE_INFINITY;
    this.minY = 0;
    this.susceptible = new Array<Point>();
    this.infected = new Array<Point>();
    this.removed = new Array<Point>();
  }

  public addSusceptiblePoint(point: Point): void {
    this.maxY = Math.max(this.maxY, point.y);
    this.susceptible.push(point);
  }

  public addInfectedPoint(point: Point): void {
    this.maxY = Math.max(this.maxY, point.y);
    this.infected.push(point);
  }

  public addRemovedPoint(point: Point): void {
    this.maxY = Math.max(this.maxY, point.y);
    this.removed.push(point);
  }

  protected draw(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(10, this.height);
    ctx.lineTo(10, 0);
    ctx.lineTo(6, 10);
    ctx.lineTo(14, 10);
    ctx.lineTo(10, 0);
    ctx.fill();
    ctx.moveTo(0, this.height - 10);
    ctx.lineTo(this.width, this.height - 10);
    ctx.lineTo(this.width - 10, this.height - 14);
    ctx.lineTo(this.width - 10, this.height - 6);
    ctx.lineTo(this.width, this.height - 10);
    ctx.fill();
    ctx.stroke();

    const hStep = (this.width - 10) / this.susceptible.length;
    const vStep = (this.height - 10) / (this.maxY - this.minY);

    if (this.susceptible.length) {
      ctx.beginPath();
      ctx.strokeStyle = 'blue';
      ctx.moveTo(10 + this.susceptible[0].x * hStep, (this.maxY - this.susceptible[0].y) * vStep);
      this.susceptible.forEach(value => {
        ctx.lineTo(10 + value.x * hStep, (this.maxY - value.y) * vStep);
      });
      ctx.stroke();
    }

    if (this.infected.length) {
      ctx.beginPath();
      ctx.strokeStyle = 'green';
      ctx.moveTo(10 + this.infected[0].x * hStep, (this.maxY - this.infected[0].y) * vStep);
      this.infected.forEach(value => {
        ctx.lineTo(10 + value.x * hStep, (this.maxY - value.y) * vStep);
      });
      ctx.stroke();
    }

    if (this.removed.length) {
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.moveTo(10 + this.removed[0].x * hStep, (this.maxY - this.removed[0].y) * vStep);
      this.removed.forEach(value => {
        ctx.lineTo(10 + value.x * hStep, (this.maxY - value.y) * vStep);
      });
      ctx.stroke();
    }
  }

  public reset(): void {
    this.resetData();
  }
}
