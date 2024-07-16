export interface BaseEvent {
    type: string;
    data: any;
}


export interface DeckEvent extends BaseEvent {
    name: string;
    size: string;
    orientation: string;
}

export interface CardField {
    id: string;
    name: string;
    type: string;
}


export type PluginUIEvent = BaseEvent | DeckEvent;