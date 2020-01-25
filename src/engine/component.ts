import { Engine } from './index';
import { NodeData, WorkerInputs, WorkerOutputs } from '../core/types';

export abstract class Component {
    name: string;
    data = new Map();
    engine: Engine | null = null;

    constructor (name: string) {
        this.name = name;
    }

    abstract worker (node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: any[]): any;
}