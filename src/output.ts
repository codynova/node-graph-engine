import { IO } from './io';
import { Socket } from './socket';
import { Input } from './input';
import { Connection } from './connection';
import { OutputDataJSON } from './core';
import { EngineError } from './errors';

export class Output extends IO {
	constructor (key: string, name: string, socket: Socket, allowMultipleConnections: boolean = true) {
		super(key, name, socket, allowMultipleConnections);
	}

	connectTo (input: Input) {
		if (!this.socket.compatibleWith(input.socket)) {
			throw new Error(EngineError.SocketsNotCompatible)
		}

		if (!input.allowMultipleConnections && input.hasConnection()) {
			throw new Error(EngineError.InputHasConnection);
		}

		if (!this.allowMultipleConnections && this.hasConnection()) {
			throw new Error(EngineError.OutputHasConnection);
		}

		const connection = new Connection(input, this);
		this.connections.push(connection);
		return connection;
	}

	connectedTo (input: Input) {
		return this.connections.some(item => item.input === input);
	}

	toJSON (): OutputDataJSON {
		return {
			'connections': this.connections.map(({ input, data }) => {
				if (!input.node) {
					throw new Error(EngineError.NodeNotFoundForInput + input.key);
				}

				return {
					nodeId: input.node.id,
					inputKey: input.key,
					data,
				};
			}),
		};
	}
}