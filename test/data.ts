import { NodeData } from '../src/core/types';

const nodeData = new Map<string, NodeData>();

nodeData.set('1', {
    id: 1,
    data: new Map().set('num', 1),
    inputs: new Map(),
    outputs: new Map().set('num', {
        connections: [
            {
                nodeId: 3,
                input: 'num1',
                data: {},
            }
        ]
    }),
    position: [ 80, 200 ],
    name: 'NumberComponent',
});

nodeData.set('2', {
    id: 2,
    data: new Map().set('num', 2),
    inputs: new Map(),
    outputs: new Map().set('num', {
        connections: [
            {
                nodeId: 3,
                input: 'num2',
                data: {},
            }
        ]
    }),
    position: [ 80, 400 ],
    name: 'NumberComponent',
});

nodeData.set('3', {
    id: 3,
    data: new Map(),
    inputs: new Map().set('num1', {
        connections: [
            {
                nodeId: 1,
                output: 'num',
                data: {},
            }
        ]
    }).set('num2', {
        connections: [
            {
                nodeId: 2,
                output: 'num',
                data: {},
            }
        ]
    }),
    outputs: new Map().set('num', {
        connections: []
    }),
    position: [ 500, 240 ],
    name: 'AddComponent',
});

export { nodeData };