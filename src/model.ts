export interface BaseEvent {
    type: string;
}


export interface Deck extends BaseEvent {
    name: string;
    size: string;
    orientation: string;
}



export type PluginUIEvent = BaseEvent | Deck;