interface Options {
    state: Record<string, any>;
    actions: Record<string, Function>;
}
export declare class EventStore {
    private state;
    private actions;
    private event;
    private eventV2;
    constructor(options: Options);
    private observe;
    onState(stateKey: string, stateCallback: Function): void;
    onStates(stateKeys: string[], stateCallback: Function): void;
    offStates(stateKeys: string[], stateCallback: Function): void;
    offState(stateKey: string, stateCallback: Function): void;
    setState(stateKey: string, stateValue: any): void;
    dispatch(actionName: string, ...args: any[]): void;
}
export {};
