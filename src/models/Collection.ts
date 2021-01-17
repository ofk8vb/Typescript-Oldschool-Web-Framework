import axios, { AxiosResponse } from 'axios';
import { Eventing } from './Eventing';

// T is a class instace, K type of structure(interface) the T class has
export class Collection<T, K> {
  models: T[] = [];
  events: Eventing = new Eventing();

  // when instantiating this Collection class we have to pass a rootUrl that is type of string to be used with fetch method
  // we also have to pass a second argument that will be a function which receives an argument of type K, and calls a function that returns an object of Type of T
  constructor(public rootUrl: string, public deserialize: (json: K) => T) {}
  // deserialize refers here to a function that will create a T type classes instance with fetched data from api

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  // fetch not only fetches data, it also stores each returned value as T type instance inside models array
  fetch(): void {
    axios.get(this.rootUrl).then((response: AxiosResponse) => {
      response.data.forEach((value: K) => {
        this.models.push(this.deserialize(value));
      });

      this.trigger('change');
    });
  }
}
