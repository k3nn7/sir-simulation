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
  private paddingX: number;
  private paddingY: number;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
    this.paddingX = 28;
    this.paddingY = 15;
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
    ctx.moveTo(this.paddingX, this.height);
    ctx.lineTo(this.paddingX, 0);
    ctx.lineTo(this.paddingX - 4, 10);
    ctx.lineTo(this.paddingX + 4, 10);
    ctx.lineTo(this.paddingX, 0);
    ctx.fill();
    ctx.moveTo(0, this.height - this.paddingY);
    ctx.lineTo(this.width, this.height - this.paddingY);
    ctx.lineTo(this.width - 10, this.height - (this.paddingY - 4));
    ctx.lineTo(this.width - 10, this.height - (this.paddingY + 4));
    ctx.lineTo(this.width, this.height - this.paddingY);
    ctx.fill();
    ctx.stroke();

    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillText('(0, 0)', 0, this.height);

    const hStep = (this.width - this.paddingX) / this.susceptible.length;
    const vStep = (this.height - this.paddingY) / (this.maxY - this.minY);

    if (this.susceptible.length) {
      ctx.beginPath();
      ctx.strokeStyle = 'blue';
      ctx.moveTo(this.paddingX + this.susceptible[0].x * hStep, (this.maxY - this.susceptible[0].y) * vStep);
      this.susceptible.forEach(value => {
        ctx.lineTo(this.paddingX + value.x * hStep, (this.maxY - value.y) * vStep);
      });
      ctx.stroke();
    }

    if (this.infected.length) {
      ctx.beginPath();
      ctx.strokeStyle = 'green';
      ctx.moveTo(this.paddingX + this.infected[0].x * hStep, (this.maxY - this.infected[0].y) * vStep);
      this.infected.forEach(value => {
        ctx.lineTo(this.paddingX + value.x * hStep, (this.maxY - value.y) * vStep);
      });
      ctx.stroke();
    }

    if (this.removed.length) {
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.moveTo(this.paddingX + this.removed[0].x * hStep, (this.maxY - this.removed[0].y) * vStep);
      this.removed.forEach(value => {
        ctx.lineTo(this.paddingX + value.x * hStep, (this.maxY - value.y) * vStep);
      });
      ctx.stroke();
    }
  }

  public reset(): void {
    this.resetData();
  }
}
