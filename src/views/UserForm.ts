import { User, UserProps } from '../models/User';
import { View } from './View';

// UserProps will be used by the generic Model class :)

export class UserForm extends View<User, UserProps> {
  // by extending the abstract View class
  // UserForm gets parent:Element, model:T from a constructor
  // parent is the target html element,
  // bindModel() method that sets an event listener for 'change'
  // necessity to implement eventsMap() and template() functions
  // bindEvents() method that looks at the html we are rendering then attaches appropriate
  // event listeners to the html elements according to return of eventsMap() we have set here
  // render() method takes the return string of our template(), then appens it to the parent element via 'template' element
  eventsMap(): { [key: string]: () => void } {
    return {
      'click:.set-age': this.onSetAgeClick,
      'click:.set-name': this.onSetNameClick,
      'click:.save-model': this.onSaveClick,
    };
  }

  onSaveClick = (): void => {
    this.model.save();
  };

  // to avoid context of 'this' error
  onSetAgeClick = (): void => {
    this.model.setRandomAge();
  };

  onSetNameClick = (): void => {
    // we find the input element inside the html
    const input = this.parent.querySelector('input');

    if (input) {
      // then extract its value, and set it no name variable
      const name = input.value;
      this.model.set({ name });
    }
  };

  template(): string {
    return `
      <div>
          <input placeholder="${this.model.get('name')}" />
          <button class="set-name">Change Name</button>
          <button class="set-age">Set Random Age</button>
          <button class="save-model">Save User</button>
      </div>
    `;
  }
}
