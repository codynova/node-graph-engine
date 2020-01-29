import { IO } from './io';
import { Control } from './control';
import { Socket } from './socket';
import { Input } from './input';
import { Connection } from './connection';
import { ErrorTypes } from './errors';

export class Output extends IO {
	constructor (key: string, name: string, socket: Socket, allowMultipleConnections: boolean = true) {
		super(key, name, socket, allowMultipleConnections);
	}

	connectTo (input: Input) {
		if (!this.socket.compatibleWith(input.socket)) {
			throw new Error(ErrorTypes.SocketsNotCompatible)
		}

		if (!input.allowMultipleConnections && input.hasConnection()) {
			throw new Error(ErrorTypes.InputHasConnection);
		}

		if (!this.allowMultipleConnections && this.hasConnection()) {
			throw new Error(ErrorTypes.OutputHasConnection);
		}

		const connection = new Connection(input, this);
		this.connections.push(connection);
		return connection;
	}

	connectedTo (input: Input) {
		return this.connections.some(item => item.input === input);
	}
}