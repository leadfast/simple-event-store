export class EventBus {
  private eventBus: Record<string, Array<{ eventCallback: Function; thisArg: any }>>;

  constructor() {
    this.eventBus = {};
  }

  on(eventName: string, eventCallback: Function, thisArg?: any): this {
    if (typeof eventName !== 'string') {
      throw new TypeError('the event name must be string type');
    }
    let handlers = this.eventBus[eventName];
    if (!handlers) {
      handlers = [];
      this.eventBus[eventName] = handlers;
    }
    handlers.push({ eventCallback, thisArg });
    return this;
  }

  once(eventName: string, eventCallback: Function, thisArg?: any): this {
    if (typeof eventName !== 'string') {
      throw new TypeError('the event name must be string type');
    }
    const tempCallback = (...payload: any[]) => {
      this.off(eventName, tempCallback);
      eventCallback.apply(thisArg, payload);
    };
    return this.on(eventName, tempCallback, thisArg);
  }

  emit(eventName: string, ...payload: any[]): this {
    if (typeof eventName !== 'string') {
      throw new TypeError('the event name must be string type');
    }
    const handlers = this.eventBus[eventName] || [];
    handlers.forEach((handler) => {
      handler.eventCallback.apply(handler.thisArg, payload);
    });
    return this;
  }

  off(eventName: string, eventCallback: Function): void {
    if (typeof eventName !== 'string') {
      throw new TypeError('the event name must be string type');
    }
    const handlers = this.eventBus[eventName];
    if (handlers && eventCallback) {
      const newHandlers = [...handlers];
      for (let i = 0; i < newHandlers.length; i++) {
        const handler = newHandlers[i];
        if (handler.eventCallback === eventCallback) {
          const index = handlers.indexOf(handler);
          handlers.splice(index, 1);
        }
      }
    }
    if (handlers.length === 0) {
      delete this.eventBus[eventName];
    }
  }

  clear(): void {
    this.eventBus = {};
  }

  hasEvent(eventName: string): boolean {
    return Object.keys(this.eventBus).includes(eventName);
  }
}
