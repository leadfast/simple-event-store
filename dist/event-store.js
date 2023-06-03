"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStore = void 0;
const event_bus_1 = require("./event-bus");
class EventStore {
    constructor(options) {
        this.actions = options.actions;
        this.state = options.state;
        this.eventV2 = new event_bus_1.EventBus();
        this.event = new event_bus_1.EventBus();
        this.observe(options.state);
    }
    observe(state) {
        const _this = this;
        Object.keys(state).forEach((key) => {
            let _value = state[key];
            Object.defineProperty(state, key, {
                get: function () {
                    return _value;
                },
                set: function (newValue) {
                    if (_value === newValue)
                        return;
                    _value = newValue;
                    _this.event.emit(key, _value);
                    _this.eventV2.emit(key, { [key]: _value });
                },
            });
        });
    }
    onState(stateKey, stateCallback) {
        const keys = Object.keys(this.state);
        if (keys.indexOf(stateKey) === -1) {
            throw new Error('the state does not contain your key');
        }
        this.event.on(stateKey, stateCallback);
        const value = this.state[stateKey];
        stateCallback.apply(this.state, [value]);
    }
    onStates(stateKeys, stateCallback) {
        const keys = Object.keys(this.state);
        const value = {};
        for (const theKey of stateKeys) {
            if (keys.indexOf(theKey) === -1) {
                throw new Error('the state does not contain your key');
            }
            this.eventV2.on(theKey, stateCallback);
            value[theKey] = this.state[theKey];
        }
        stateCallback.apply(this.state, [value]);
    }
    offStates(stateKeys, stateCallback) {
        const keys = Object.keys(this.state);
        stateKeys.forEach((theKey) => {
            if (keys.indexOf(theKey) === -1) {
                throw new Error('the state does not contain your key');
            }
            this.eventV2.off(theKey, stateCallback);
        });
    }
    offState(stateKey, stateCallback) {
        const keys = Object.keys(this.state);
        if (keys.indexOf(stateKey) === -1) {
            throw new Error('the state does not contain your key');
        }
        this.event.off(stateKey, stateCallback);
    }
    setState(stateKey, stateValue) {
        this.state[stateKey] = stateValue;
    }
    dispatch(actionName, ...args) {
        if (Object.keys(this.actions).indexOf(actionName) === -1) {
            throw new Error('this action name does not exist, please check it');
        }
        const actionFn = this.actions[actionName];
        actionFn.apply(this, [this.state, ...args]);
    }
}
exports.EventStore = EventStore;
