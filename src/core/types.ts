export type ConnectionData = { nodeId: number, data: any }

export type InputConnectionData = ConnectionData & { outputKey: string }

export type OutputConnectionData = ConnectionData & { inputKey: string }

export type InputData = { connections: InputConnectionData[] }

export type InputDataJSON = InputData

export type OutputData = { connections: OutputConnectionData[] }

export type OutputDataJSON = OutputData

export type InputsData = Map<string, InputData>

export type InputsDataJSON = { [key: string]: InputData }

export type OutputsData = Map<string, OutputData>

export type OutputsDataJSON = { [key: string]: OutputData }

export type NodeData = {
	id: number;
	name: string;
	data: Map<string, any>;
	inputs: InputsData;
	outputs: OutputsData;
	position: [number, number];
}

export type NodeDataJSON = {
	id: number;
	name: string;
	data: { [key: string]: any };
	inputs: InputsDataJSON;
	outputs: OutputsDataJSON;
	position: [number, number];
}

export type NodesData = Map<NodeData['id'], NodeData>

export type NodesDataJSON = { [key in NodeData['id']]: NodeDataJSON }

export type EngineData = { id: string, nodes: NodesData }

export type EngineDataJSON = { id: string, nodes: NodesDataJSON }

export type WorkerInputs = Map<string, any[]>

export type WorkerOutputs = Map<string, any>