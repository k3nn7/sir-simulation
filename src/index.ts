import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Renderer from "./engine/Renderer";
import {Simulation} from "./view/Simulation";
import {SimulationController} from "./controller/SimulationController";

const canvas = <HTMLCanvasElement>document.getElementById('simulation');
const renderer = new Renderer(canvas.getContext('2d'));

const startSimulationButton = <HTMLButtonElement>document.getElementById('start-simulation');
const horizontalCellsInput = <HTMLInputElement>document.getElementById('input-horizontal-cells');
const verticalCellsInput = <HTMLInputElement>document.getElementById('input-vertical-cells');
const infectedCellsInput = <HTMLInputElement>document.getElementById('input-infected-cells');
const cInput = <HTMLInputElement>document.getElementById('input-c');

const view = new Simulation(canvas.width, canvas.height);
const controller = new SimulationController(
  view,
  horizontalCellsInput,
  verticalCellsInput,
  infectedCellsInput,
  cInput,
);

renderer.addObject(view);

startSimulationButton.addEventListener('click', async () => {
  await controller.start();
});

function frame() {
  renderer.render();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

