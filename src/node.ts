import { Input } from './input';
import { Output } from './output';
import { Connection } from './connection';
import { Control } from './control';
import { NodeDataJSON, InputsDataJSON, OutputsDataJSON, NodeData, InputsData, OutputsData } from './core';
import { EngineError } from './errors';

export class Node {
	id: number;
	name: string;
	data = new Map<string, unknown>();
	inputs = new Map<string, Input>();
	outputs = new Map<string, Output>();
	controls = new Map<string, Control>();
	position: [number, number] = [0.0, 0.0];
	static latestId = 0;

	constructor (name: string) {
		this.name = name;
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
			throw new Error(EngineError.ItemExistsOnThisNode);
		}

		if (item[key] !== null) {
			throw new Error(EngineError.ItemExistsOnSomeNode);
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

	toJSON (): NodeDataJSON {
		const data: { [key: string]: any } = {};

		for (const entry of this.data) {
			data[entry[0]] = entry[1];
		}

		const inputs: InputsDataJSON = {};

		for (const entry of this.inputs) {
			inputs[entry[0]] = entry[1].toJSON();
		}

		const outputs: OutputsDataJSON = {};

		for (const entry of this.outputs) {
			outputs[entry[0]] = entry[1].toJSON();
		}

		// TO DO: do these properties need to be quoted?
		return {
			'id': this.id,
			'name': this.name,
			'data': data,
			'inputs': inputs,
			'outputs': outputs,
			'position': this.position,
		}
	}

	static fromJSON (json: NodeDataJSON): Node {
		const node = new Node(json.name);
		node.id = json.id;
		node.data = new Map<string, unknown>();
		Object.entries(json.data).forEach(([ key, value ]) => node.data.set(key, value));
		const [ x, y ] = json.position;
		node.position = [ x, y ];
		Node.latestId = Math.max(node.id, Node.latestId);
		return node;
	}

	update () {}
}