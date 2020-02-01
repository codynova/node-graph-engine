import { Emitter } from './emitter';
import { DefaultEvents, Events } from './events';
import { Component } from '../engine/component';
import { Plugin, PluginParams } from './plugin';
import { Validator } from './validator';
import { EngineError } from '../errors';

export class Context<EventTypes> extends Emitter<EventTypes & DefaultEvents> {
	id: string;
	plugins = new Map<string, any>();
	components = new Map<string, Component>();

	constructor (id: string, events: Events) {
		super(events);

		if (!Validator.isValidId(id)) {
			throw new Error(EngineError.InvalidEngineIDFormat);
		}

		this.id = id;

		// TO DO: delete this if it's not needed...
		// is there any difference in initializing here?
		
		// this.plugins = new Map();
        // this.components = new Map();
	}

	use <T extends Plugin, O extends PluginParams<T>>(plugin: T, options?: O) {
		if (this.plugins.has(plugin.name)) {
			throw new Error(EngineError.PluginAlreadyExists);
		}

		plugin.install(this, options || {});
		this.plugins.set(plugin.name, options);
	}

	register (component: Component) {
		if (this.components.has(component.name)) {
			throw new Error(EngineError.ComponentAlreadyExists);
		}

		this.components.set(component.name, component);
		this.trigger('componentregister');
	}

	destroy () {
		this.trigger('destroy');
	}
}