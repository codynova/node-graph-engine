import { Input } from './input';
import { Output } from './output';
import { Connection } from './connection';
import { Control } from './control';
import { ErrorTypes } from './errors';

export class Node {
	static latestId = 0;

	guid: string;
	id: number;
	data = new Map<string, unknown>();
	inputs = new Map<string, Input>();
	outputs = new Map<string, Output>();
	controls = new Map<string, Control>();
	position: [number, number] = [0.0, 0.0];

	constructor (
		public name: string,
	) {
		this.id = Node.nextId();
	}

	static nextId () {
		if (!this.latestId) {
			this.latestId = 1;
		}
		else {
			this.latestId++;
		}
		return this.latestId;
	}

	static resetId () {
		this.latestId = 0;
	}

	private add <T extends any>(map: Map<string, T>, item: T, key: string) {
		if (map.has(item.key)) {
			throw new Error(ErrorTypes.ItemExistsOnThisNode);
		}

		if (item[key] !== null) {
			throw new Error(ErrorTypes.ItemExistsOnSomeNode);
		}

		item[key] = this;
		map.set(item.key, item);
	}

	addControl (control: Control) {
		this.add(this.controls, control, 'parent');
		return this;
	}

	removeControl (control: Control) {
		control.parent = null;
		this.controls.delete(control.key);
	}

	addInput (input: Input) {
		this.add(this.inputs, input, 'node');
		return this;
	}

	removeInput (input: Input) {
		input.removeAllConnections();
		input.node = null;
		this.inputs.delete(input.key);
	}

	addOutput (output: Output) {
		this.add(this.outputs, output, 'node');
		return this;
	}

	removeOutput (output: Output) {
		output.removeAllConnections();
		output.node = null;
		this.outputs.delete(output.key);
	}

	getConnections () {
		const connections: Connection[] = [];

		for (const input of this.inputs.values()) {
			for (const connection of input.connections) {
				connections.push(connection);
			}
		}

		for (const output of this.outputs.values()) {
			for (const connection of output.connections) {
				connections.push(connection);
			}
		}

		return connections;
	}
}