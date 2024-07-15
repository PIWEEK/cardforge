export interface BaseEvent {
    type: string;
}


export interface DeckEvent extends BaseEvent {
    name: string;
    size: string;
    orientation: string;
}



export type PluginUIEvent = BaseEvent | DeckEvent;