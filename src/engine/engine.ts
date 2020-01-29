import { Context } from '../core/context';
import { DefaultEngineEvents, EngineEvents } from './events';
import { EngineData, NodeData, WorkerOutputs, NodesData } from '../core/types';
import { EngineError } from '../errors';

enum EngineState {
	AVAILABLE = 0,
	PROCESSED = 1,
	ABORT = 2
}

type EngineNode = NodeData & {
	busy: boolean;
	unlockPool: (() => void)[];
	outputData: WorkerOutputs;
}

export class Engine extends Context<DefaultEngineEvents> {
	args: any[] = [];
	data: EngineData | null = null;
	state = EngineState.AVAILABLE;
	onAbort = () => {};

	constructor (id: string) {
		super(id, new EngineEvents());
	}

	clone () {
		const engine = new Engine(this.id);
		this.components.forEach(c => engine.register(c));
		return engine;
	}

	private processStart () {
		if (this.state === EngineState.AVAILABLE) {
			this.state = EngineState.PROCESSED;
			return true;
		}

		if (this.state === EngineState.ABORT) {
			return false;
		}

		console.warn(`The process is busy and has not been restarted.
				Use abort() to force it to complete`);

		return false;
	}

	private processDone () {
		const success = this.state !== EngineState.ABORT;
		this.state = EngineState.AVAILABLE;

		if (!success) {
			this.onAbort();
			this.onAbort = () => {};
		}

		return success;
	}

	async abort () {
		return new Promise(resolve => {
			if (this.state === EngineState.PROCESSED) {
				this.state = EngineState.ABORT;
				this.onAbort = resolve;
			}
			else if (this.state === EngineState.ABORT) {
				this.onAbort();
				this.onAbort = resolve;
			}
			else {
				resolve();
			}
		});
	}

	private async lock (node: EngineNode) {
		return new Promise(resolve => {
			node.unlockPool = node.unlockPool || [];

			if (node.busy && !node.outputData) {
				node.unlockPool.push(resolve);
			}
			else {
				resolve();
			}

			node.busy = true;
		});
	}

	unlock (node: EngineNode) {
		node.unlockPool.forEach(unlock => unlock());
		node.unlockPool = [];
		node.busy = false;
	}

	private async processWorker (node: NodeData) {
		const inputData = await this.extractInputData(node);
		const component = this.components.get(node.name);
		const outputData = new Map();

		try {
			await component!.worker(node, inputData, outputData, ...this.args);
		}
		catch (error) {
			this.abort();
			this.trigger('warn', error);
		}

		return outputData;
	}

	private async processNode (node: EngineNode) {
		if (this.state === EngineState.ABORT || !node) {
			return null;
		}

		await this.lock(node);

		// TO DO: see if you can improve this (speed it up)
		if (!node.outputData) {
			node.outputData = await this.processWorker(node);
		}

		this.unlock(node);
		return node.outputData;
	}

	private async extractInputData (node: NodeData) {
		const map = new Map<string, any>();

		for (const key of node.inputs.keys()) {
			const input = node.inputs.get(key)!;
			const connectionData = await Promise.all(input.connections.map(async connection => {
				const previousNode = this.data!.nodes.get(`${connection.nodeId}`)!;
				const outputs = await this.processNode(previousNode as EngineNode);

				if (!outputs) {
					this.abort();
				}
				else {
					return outputs.get(connection.outputKey);
				}
			}));

			map.set(key, connectionData);
		}

		return map;
	}

	private async forwardProcess (node: NodeData) {
		if (this.state === EngineState.ABORT) {
			return null;
		}

		// TO DO: see if you can improve this...

		const processOutputs = [];

		for (const key of node.outputs.keys()) {
			processOutputs.push(new Promise(async resolve => {
				const output = node.outputs.get(key)!;

				return resolve(await Promise.all(output.connections.map(async connection => {
					const nextNode = this.data!.nodes.get(`${connection.nodeId}`)!;
					await this.processNode(nextNode as EngineNode);
					await this.forwardProcess(nextNode);
				})));
			}));
		}

		return await Promise.all(processOutputs);
	}

	// TO DO: clean this up
	copy (data: EngineData) {
		data = { ...data };
		data.nodes = new Map(data.nodes);
		
		for (const key of data.nodes.keys()) {
			data.nodes.set(key, { ...data.nodes.get(key)! });
		}

		return data;

		// data = Object.assign({}, data);
		// data.nodes = Object.assign({}, data.nodes);
		
		// Object.keys(data.nodes).forEach(key => {
		//     data.nodes[key] = Object.assign({}, data.nodes[key])
		// });
		// return data;
	}

	async throwError (message: string, data: any = null) {
		await this.abort();
		this.trigger('error', { message, data });
		this.processDone();
		return 'error';
	}

	async validate (data: EngineData) {
		// TO DO: implement this

		return true;
	}

	private async processStartNode (id: string | null) {
		if (!id) {
			return;
		}

		const startNode = this.data!.nodes.get(id);

		if (!startNode) {
			return await this.throwError(EngineError.StartNodeNotFound + id);
		}

		await this.processNode(startNode as EngineNode);
		await this.forwardProcess(startNode);
	}

	private async processUnreachableNodes () {
		for (const node of this.data!.nodes.values() as IterableIterator<EngineNode>) {
			if (node.outputData === undefined) {
				await this.processNode(node);
				await this.forwardProcess(node);
			}
		}
	}

	async process <T extends unknown[]>(data: EngineData, startId: string | null = null, ...args: T) {
		if (!this.processStart()) {
			return;
		}

		if (!this.validate(data)) {
			return;
		}

		this.data = this.copy(data);
		this.args = args;

		await this.processStartNode(startId);
		await this.processUnreachableNodes();

		return this.processDone() ? 'success' : 'aborted';
	}
}