import { User } from '../models/User';
import { Model } from '../models/Model';

// this K is because Model is also an generic class that uses a generic like UserProps
// so whatever class extends the View abstract class should also pass in a generic for the Model class to use
export abstract class View<T extends Model<K>, K> {
  regions: { [key: string]: Element } = {};
  constructor(public parent: Element, public model: T) {
    this.bindModel();
  }

  // class that extends abstract View class must implement these two following methods
  // for this View class to function

  abstract template(): string;

  // eventsMap no longer required to be implemented in a child class(optional now)
  // we do it so classes that extends Abstract View class don't have to implement an eventsMap if they don't have to
  eventsMap(): { [key: string]: () => void } {
    return {};
  }

  regionsMap(): { [key: string]: string } {
    return {};
  }

  mapRegions(fragment: DocumentFragment): void {
    const regionsMap = this.regionsMap();

    for (let key in regionsMap) {
      const selector = regionsMap[key];
      const element = fragment.querySelector(selector);
      if (element) {
        this.regions[key] = element;
      }
    }
  }

  bindModel(): void {
    // as soon as a new UserForm in instantiated with a model,
    // we activate that models listener on 'change' to rerender our UserForm class
    // whenever 'change' event is triggered
    this.model.on('change', () => {
      this.render();
    });
  }

  // will be binding our event methods to the html
  bindEvents(fragment: DocumentFragment): void {
    // we get the events tied to this UserForm class
    const eventsMap = this.eventsMap();

    // we iterate over each key of eventsMap object
    for (let eventKey in eventsMap) {
      // we get back an array with two elements inside
      // for instance ['click','button']
      const [eventName, selector] = eventKey.split(':');

      // find all the elements inside the html that matches this selector
      // then call forEach in the return value of querySelectorAll
      // then for each element call element.addEventListener(eventName, eventsMap[eventKey]) to
      // bind the corresponding callback function to that particular event
      fragment.querySelectorAll(selector).forEach((element) => {
        //add an event listener to the html element with eventName, then the listener will be calling the function in eventsMap[eventKey]
        element.addEventListener(eventName, eventsMap[eventKey]);
      });
    }
  }

  onRender(): void {}

  render(): void {
    // anytime render is called we want to empty existing html in parent, so we do not generate additional html during rerenders
    this.parent.innerHTML = '';

    // creates an template element that holds an valid html string in its innerHTML
    const templateElement = document.createElement('template');
    templateElement.innerHTML = this.template();

    // we pass in the DocumentFragment to the bindEvents so bindEvents function will check for
    // events that we defined a function for inside eventsMap, and attach appropriate event listeners with callback functions

    this.bindEvents(templateElement.content);
    this.mapRegions(templateElement.content);

    this.onRender();

    // content property is a reference to a (type of) DocumentFragment (actual html element)
    // DocumentFragment's purpose is to hold some html  in memory before it is attached to the DOM
    this.parent.append(templateElement.content);
  }
}
