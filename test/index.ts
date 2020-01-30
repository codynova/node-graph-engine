import { Engine, EngineData } from '../src';
import { NumberComponent, AddComponent } from './components';
import { nodeData } from './data';

const init = async () => {
    const id = 'test@0.0.1';
    const engine = new Engine(id);
    const engineData: EngineData = { id, nodes: nodeData };
    engine.events.set('warn', []);
    engine.events.set('error', []);
    engine.register(new NumberComponent());
    engine.register(new AddComponent());
    const result = await engine.process(engineData, '1');
    console.log('Process = ', result);
    console.log(engineData.nodes.get('1')!.data);
    console.log(engineData.nodes.get('2')!.data);
    console.log(engineData.nodes.get('3')!.data);
};

init();