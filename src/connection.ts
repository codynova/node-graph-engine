import { Input } from './input';
import { Output } from './output';

export class Connection {
	input: Input;
	output: Output;
	// TO DO: update this to be a map
	data: unknown = {};

	constructor (input: Input, output: Output) {
		this.input = input;
		this.output = output;
		this.input.addConnection(this);
	}

	remove () {
		this.input.removeConnection(this);
		this.output.removeConnection(this);
	}
}