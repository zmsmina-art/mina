import { SimulationState } from './state/SimulationState.js';
import { SimulationEngine } from './engine/SimulationEngine.js';
import { ScenarioRunner } from './engine/ScenarioRunner.js';
import { EventBus } from './utils/EventBus.js';
import { TabRouter } from './components/TabRouter.js';
import { SimulatorTab } from './components/SimulatorTab.js';
import { ArchitectureTab } from './components/ArchitectureTab.js';
import { SignalsTab } from './components/SignalsTab.js';
import { Tooltips } from './components/Tooltips.js';
import { Beeper } from './audio/Beeper.js';

document.addEventListener('DOMContentLoaded', () => {
  const engine = new SimulationEngine(SimulationState);
  const scenarioRunner = new ScenarioRunner(SimulationState);

  const simulatorTab = new SimulatorTab(SimulationState, engine, scenarioRunner);
  const architectureTab = new ArchitectureTab();
  const signalsTab = new SignalsTab(SimulationState);

  const tabRouter = new TabRouter([
    { id: 'simulator', label: 'Simulator', component: simulatorTab },
    { id: 'architecture', label: 'Architecture', component: architectureTab },
    { id: 'signals', label: 'Signals', component: signalsTab },
  ]);

  tabRouter.mount(document.getElementById('app'));

  engine.start();

  const beeper = new Beeper();
  EventBus.on('keypress', () => beeper.play());

  new Tooltips();
});
