import { Node } from './node';
import { Input } from './input';
import { ErrorTypes } from './errors';

export abstract class Control {
	key: string;
	// TO DO: update this to be a map
	data: unknown = {};
	parent: Node | Input | null = null;

	constructor (key: string) {
		this.key = key;
	}

	getNode () {
		if (this.parent instanceof Node) {
			return this.parent;
		}

		if (!this.parent || !this.parent.node) {
			throw new Error(ErrorTypes.ControlNotParented);
		}

		return this.parent.node;
	}

	getData (key: string) {
		return this.getNode().data.get(key);
	}

	putData (key: string, data: unknown) {
		this.getNode().data.set(key, data);
	}
}