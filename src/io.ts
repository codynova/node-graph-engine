import { Node } from './node';
import { Connection } from './connection';
import { Socket } from './socket';

export class IO {
    key: string;
    name: string;
    node: Node | null = null;
    socket: Socket;
    connections: Connection[] = [];
    allowMultipleConnections: boolean;

    constructor (key: string, name: string = '', socket: Socket, allowMultipleConnections: boolean) {
        this.key = key;
        this.name = name;
        this.socket = socket;
        this.allowMultipleConnections = allowMultipleConnections;
    }

    hasConnection () {
        return this.connections.length > 0;
    }

    removeConnection (connection: Connection) {
        this.connections.splice(this.connections.indexOf(connection), 1);
    }

    removeAllConnections () {
        this.connections.forEach(connection => this.removeConnection(connection));
    }
}