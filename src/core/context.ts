import { Emitter } from './emitter';
import { DefaultEvents, Events } from './events';
import { Component } from '../engine/component';
import { Plugin, PluginParams } from './plugin';
import { ErrorTypes } from '../errors';

export class Context<EventTypes> extends Emitter<EventTypes & DefaultEvents> {
    id: string;
    plugins = new Map<string, any>();
    components = new Map<string, Component>();

    constructor (id: string, events: Events) {
        super(events);

        // TO DO: validate id?

        this.id = id;
    }

    use <T extends Plugin, O extends PluginParams<T>>(plugin: T, options: O) {
        if (this.plugins.has(plugin.name)) {
            throw new Error(ErrorTypes.PluginAlreadyExists);
        }

        plugin.install(this, options || {});
        this.plugins.set(plugin.name, options);
    }

    register (component: Component) {
        if (this.components.has(component.name)) {
            throw new Error(ErrorTypes.ComponentAlreadyExists);
        }

        this.components.set(component.name, component);
        this.trigger('componentregister');
    }

    destroy () {
        this.trigger('destroy');
    }
}