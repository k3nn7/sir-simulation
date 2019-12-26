import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Renderer from "./engine/Renderer";
import {Simulation} from "./view/Simulation";
import {SimulationController} from "./controller/SimulationController";
import {Graph} from "./view/Graph";
import Vector2D from "./engine/Vector2D";

const canvas = <HTMLCanvasElement>document.getElementById('simulation');
const renderer = new Renderer(canvas.getContext('2d'));

const startSimulationButton = <HTMLButtonElement>document.getElementById('start-simulation');
const horizontalCellsInput = <HTMLInputElement>document.getElementById('input-horizontal-cells');
const verticalCellsInput = <HTMLInputElement>document.getElementById('input-vertical-cells');
const infectedCellsInput = <HTMLInputElement>document.getElementById('input-infected-cells');
const cInput = <HTMLInputElement>document.getElementById('input-c');

const view = new Simulation(300, 300);
const graph = new Graph(300, 300);

const controller = new SimulationController(
  view,
  graph,
  horizontalCellsInput,
  verticalCellsInput,
  infectedCellsInput,
  cInput,
);

graph.translate(new Vector2D(350, 0))
renderer.addObject(view);
renderer.addObject(graph);

startSimulationButton.addEventListener('click', async () => {
  await controller.start();
});

function frame() {
  renderer.render();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

