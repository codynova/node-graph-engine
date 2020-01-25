import { Component } from '../src/engine/component';
import { Node } from '../src/node';
import { Input } from '../src/input';
import { Output } from '../src/output';
import { Socket } from '../src/socket';

const socket = new Socket('Number');

export class NumberComponent extends Component {
    constructor () {
        super('NumberComponent');
    }

    async builder (node: Node) {
        node.addOutput(new Output('num', 'Name', socket));
    }

    worker () {}
}

export class AddComponent extends Component {
    constructor () {
        super('AddComponent');
    }

    async builder (node: Node) {
        node.addInput(new Input('num1', 'Name', socket));
        node.addInput(new Input('num2', 'Name', socket));
        node.addOutput(new Output('num', 'Name', socket));
    }

    worker () {}
}