export enum ErrorTypes {
    ControlNotParented = 'Control has no parent node or input',
    InputHasConnection = 'Input already has a connection, and multiple connections are not allowed',
    OutputHasConnection = 'Output already has a connection, and multiple connections are not allowed',
    MultipleConnectionsDisallowed = 'Multiple connections are not allowed',
    SocketsNotCompatible = 'Sockets are not compatible to be connected',
    ItemExistsOnThisNode = 'Item already exists on this node',
    ItemExistsOnSomeNode = 'Item already exists on some node',
    EventNameUndefined = 'No event exists with name: ',
    EventTriggerFailed = 'Failed to trigger event with name: ',
    EventAlreadyBound = 'Event already bound with name: ',
    ComponentAlreadyExists = 'Component already exists with name: ',
    PluginAlreadyExists = 'Plugin already exists with name: ',
    StartNodeNotFound = 'Failed to find start node with id: ',
}