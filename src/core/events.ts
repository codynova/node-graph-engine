import { Component } from '../engine/component';

export class Events {
	handlers = new Map<string, Function[]>();

	constructor (handlers: Map<string, Function[]>) {
		this.handlers.set('warn', [ console.warn ]);
		this.handlers.set('error', [ console.error ]);
		this.handlers.set('componentregister', []);
		this.handlers.set('destroy', []);
		handlers.forEach((value, key) => this.handlers.set(key, value));
	}
}

export interface DefaultEvents {
	warn: string | Error;
	error: string | Error;
	destroy: void;
	componentregister: Component;
}