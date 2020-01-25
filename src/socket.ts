export class Socket {
    name: string;
    data: unknown;
    compatibles: Socket[] = [];

    constructor (name: string, data = {}) {
        this.name = name;
        this.data = data;
    }

    combineWith (socket: Socket) {
        this.compatibles.push(socket);
    }

    compatibleWith (socket: Socket) {
        return this === socket || this.compatibles.includes(socket);
    }
}