import { EventBus } from './event-bus';

interface Options {
  state: Record<string, any>;
  actions: Record<string, Function>;
}

export class EventStore {
  private state: Record<string, any>;
  private actions: Record<string, Function>;
  private event: EventBus;
  private eventV2: EventBus;

  constructor(options: Options) {
    this.actions = options.actions;
    this.state = options.state;

    this.eventV2 = new EventBus();
    this.event = new EventBus();

    this.observe(options.state);
  }

  private observe(state: Record<string, any>): void {
    const _this = this;
    Object.keys(state).forEach((key) => {
      let _value = state[key];
      Object.defineProperty(state, key, {
        get: function () {
          return _value;
        },
        set: function (newValue) {
          if (_value === newValue) return;
          _value = newValue;
          _this.event.emit(key, _value);
          _this.eventV2.emit(key, { [key]: _value });
        },
      });
    });
  }

  onState(stateKey: string, stateCallback: Function): void {
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error('the state does not contain your key');
    }
    this.event.on(stateKey, stateCallback);
    const value = this.state[stateKey];
    stateCallback.apply(this.state, [value]);
  }

  onStates(stateKeys: string[], stateCallback: Function): void {
    const keys = Object.keys(this.state);
    const value: Record<string, any> = {};
    for (const theKey of stateKeys) {
      if (keys.indexOf(theKey) === -1) {
        throw new Error('the state does not contain your key');
      }
      this.eventV2.on(theKey, stateCallback);
      value[theKey] = this.state[theKey];
    }
    stateCallback.apply(this.state, [value]);
  }

  offStates(stateKeys: string[], stateCallback: Function): void {
    const keys = Object.keys(this.state);
    stateKeys.forEach((theKey) => {
      if (keys.indexOf(theKey) === -1) {
        throw new Error('the state does not contain your key');
      }
      this.eventV2.off(theKey, stateCallback);
    });
  }

  offState(stateKey: string, stateCallback: Function): void {
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error('the state does not contain your key');
    }
    this.event.off(stateKey, stateCallback);
  }

  setState(stateKey: string, stateValue: any): void {
    this.state[stateKey] = stateValue;
  }

  dispatch(actionName: string, ...args: any[]): void {
    if (Object.keys(this.actions).indexOf(actionName) === -1) {
      throw new Error('this action name does not exist, please check it');
    }
    const actionFn = this.actions[actionName];
    actionFn.apply(this, [this.state, ...args]);
  }
}
