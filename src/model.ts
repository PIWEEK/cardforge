export interface BaseEvent {
    type: string;
    data: string;
}


export interface DeckEvent extends BaseEvent {
    name: string;
    size: string;
    orientation: string;
}

export interface CardField {
    name: string;
    type: string;
}


export type PluginUIEvent = BaseEvent | DeckEvent;