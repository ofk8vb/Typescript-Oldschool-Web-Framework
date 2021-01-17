import { AxiosPromise, AxiosResponse } from 'axios';

interface ModelAttributes<T> {
  set(value: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface Events {
  // () => void means callback function
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}

interface HasId {
  id?: number;
}
export class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

  // returns a reference to the on method defined in Eventing class
  // ie user.on() is equal to user.events.on();
  // get on() {
  //   return this.events.on;
  // }

  // These are executed after the constructor initializing, so this type of passthrough cannot be used if
  // classes are being initialized inside constructor function. Works if classes are initialized in constructor arguments though!
  on = this.events.on;
  trigger = this.events.trigger;
  get = this.attributes.get;

  // get trigger() {
  //   return this.events.trigger;
  // }

  // get get() {
  //   return this.attributes.get;
  // }

  // sets the current values(attributes) of the User instance this method is being called on
  set(update: T): void {
    this.attributes.set(update);
    // this event trigger will tell other parts of our application something changed if they listen to event called 'change'
    this.events.trigger('change');
  }

  // gets the id of the user this function is being called on.
  // then makes an axios request to DB with that id, then sets (updates) the
  // value of the User instance (user) to the fetch value inside it
  fetch(): void {
    const id = this.get('id');

    if (typeof id !== 'number') {
      throw new Error('Cannot fetch without an id');
    }

    this.sync.fetch(id).then((response: AxiosResponse): void => {
      this.set(response.data);
    });
  }

  save(): void {
    const data = this.attributes.getAll();
    this.sync
      .save(data)
      .then((response: AxiosResponse): void => {
        // this event trigger will run when a data is successfully saved
        this.trigger('save');
      })
      .catch(() => {
        this.trigger('error');
      });
  }
}
