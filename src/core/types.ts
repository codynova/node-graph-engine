export type ConnectionData = { nodeId: number, data: any }

export type InputConnectionData = ConnectionData & { outputKey: string }

export type OutputConnectionData = ConnectionData & { inputKey: string }

export type InputData = { connections: InputConnectionData[] }

export type OutputData = { connections: OutputConnectionData[] }

export type InputsData = Map<string, InputData>

export type OutputsData = Map<string, OutputData>

export type NodeData = {
	id: number;
	name: string;
	data: Map<string, any>;
	inputs: InputsData;
	outputs: OutputsData;
	position: [number, number];
}

export type NodesData = Map<string, NodeData>

export type EngineData = { id: string, nodes: NodesData }

// export interface WorkerInputs extends Map<string, any[]> {}

// export interface WorkerOutputs extends Map<string, any> {}

export type WorkerInputs = Map<string, any[]>

export type WorkerOutputs = Map<string, any>