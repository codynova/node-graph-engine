import { Events } from './events';
import { ErrorTypes } from '../errors';

export class Emitter<EventTypes> {
	events = new Map<string, Function[]>();
	silent = false;

	constructor (source: Events | Emitter<EventTypes>) {
		this.events = source instanceof Emitter ? source.events : source.handlers;
	}

	on <K extends keyof EventTypes & string>(eventNames: K | K[], handler: (args: EventTypes[K]) => any) {
		const events = Array.isArray(eventNames) ? eventNames : eventNames.split(' ');

		events.forEach(eventName => {
			const event = this.events.get(eventName);

			if (!event) {
				throw new Error(ErrorTypes.EventNameUndefined + eventName);
			}

			event.push(handler);
		});

		return this;
	}

	trigger <K extends keyof EventTypes & string>(eventName: K, params: EventTypes[K] | {} = {}) {
		const event = this.events.get(eventName);
		
		if (!event) {
			throw new Error(ErrorTypes.EventTriggerFailed + eventName);
		}

		return event.reduce((accumulator: boolean, handler: Function) => handler(params) !== false && accumulator, true);
	}

	bind (eventName: string) {
		if (this.events.get(eventName)) {
			throw new Error(ErrorTypes.EventAlreadyBound + eventName);
		}

		this.events.set(eventName, []);
	}

	// TO DO: is this used anywhere?
	exist (eventName: string) {
		return Array.isArray(this.events.get(eventName));
	}
}