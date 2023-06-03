export declare class EventBus {
    private eventBus;
    constructor();
    on(eventName: string, eventCallback: Function, thisArg?: any): this;
    once(eventName: string, eventCallback: Function, thisArg?: any): this;
    emit(eventName: string, ...payload: any[]): this;
    off(eventName: string, eventCallback: Function): void;
    clear(): void;
    hasEvent(eventName: string): boolean;
}
