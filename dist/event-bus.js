"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
class EventBus {
    constructor() {
        this.eventBus = {};
    }
    on(eventName, eventCallback, thisArg) {
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
    once(eventName, eventCallback, thisArg) {
        if (typeof eventName !== 'string') {
            throw new TypeError('the event name must be string type');
        }
        const tempCallback = (...payload) => {
            this.off(eventName, tempCallback);
            eventCallback.apply(thisArg, payload);
        };
        return this.on(eventName, tempCallback, thisArg);
    }
    emit(eventName, ...payload) {
        if (typeof eventName !== 'string') {
            throw new TypeError('the event name must be string type');
        }
        const handlers = this.eventBus[eventName] || [];
        handlers.forEach((handler) => {
            handler.eventCallback.apply(handler.thisArg, payload);
        });
        return this;
    }
    off(eventName, eventCallback) {
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
    clear() {
        this.eventBus = {};
    }
    hasEvent(eventName) {
        return Object.keys(this.eventBus).includes(eventName);
    }
}
exports.EventBus = EventBus;
