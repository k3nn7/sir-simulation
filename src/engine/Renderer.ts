import Renderable from "./Renderable";

export default class Renderer {
  ctx: CanvasRenderingContext2D;
  objects: Array<Renderable>;
  previousFrame: number;
  fps: number;
  capturedFps: number;
  fpsCaptureTime: number;

  public constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
    this.objects = Array<Renderable>();
    this.previousFrame = (new Date()).getTime();
    this.fpsCaptureTime = (new Date()).getTime() - 2000;
  }

  public addObject(object: Renderable): number {
    return this.objects.push(object) - 1;
  }

  public removeObject(i: number) {
    delete this.objects[i];
  }

  public render() {
    this.clearScreen();

    const now = (new Date()).getTime();
    this.fps = 1000 / (now - this.previousFrame);
    this.previousFrame = now;

    this.objects.forEach((object: Renderable) => {
      this.ctx.strokeStyle = 'black';
      object.render(this.ctx, now);
    });

    if ((now - this.fpsCaptureTime) > 1000) {
      this.fpsCaptureTime = now;
      this.capturedFps = this.fps;
    }

    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = 'green';
    this.ctx.fillText(Math.round(this.capturedFps) + ' FPS', this.ctx.canvas.width, 0);
  }

  private clearScreen() {
    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'black';
    this.ctx.clearRect(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }
}
