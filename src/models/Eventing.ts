// Callback is a function with no name, no argument, no return value
type Callback = () => void;

export class Eventing {
  // events will be an object that has an array with keys that are string, each having a value of arrays of Callback functions
  // we do not know what properties this object will be!

  events: { [key: string]: Callback[] } = {};

  // custom event listener

  on = (eventName: string, callback: Callback): void => {
    // we have to prevent duplicate registered eventNames
    // if there is an event we will get that one, if it is undefined we will get an empty array
    const handlers = this.events[eventName] || [];
    // we push either to an brand new empty array, or the existing array with the key of eventName inside this.events object
    handlers.push(callback);

    // this.events object property with eventName key is updated with a new array
    this.events[eventName] = handlers;
  };

  // custom event trigger!

  trigger = (eventName: string): void => {
    const handlers = this.events[eventName];

    // if there is no key of eventName inside this.events object, or the key has an empty array just return from this function
    if (!handlers || handlers.length === 0) {
      return;
    }

    // for each member of array, call it
    handlers.forEach((callback) => {
      callback();
    });
  };
}
