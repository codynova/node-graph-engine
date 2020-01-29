import { IO } from './io';
import { Control } from './control';
import { Socket } from './socket';
import { Connection } from './connection';
import { ErrorTypes } from './errors';

export class Input extends IO {
	control: Control | null = null;

	constructor (key: string, name: string, socket: Socket, allowMultipleConnections: boolean = false) {
		super(key, name, socket, allowMultipleConnections);
	}

	addConnection (connection: Connection) {
		if (!this.allowMultipleConnections && this.hasConnection()) {
			throw new Error(ErrorTypes.MultipleConnectionsDisallowed);
		}
	}

	addControl (control: Control) {
		this.control = control;
		control.parent = this;
	}

	showControl () {
		return !this.hasConnection() && this.control !== null;
	}
}