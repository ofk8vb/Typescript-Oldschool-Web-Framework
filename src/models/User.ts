import { Model } from './Model';
import { Attributes } from './Attributes';
import { ApiSync } from './ApiSync';
import { Eventing } from './Eventing';
import { Collection } from './Collection';

export interface UserProps {
  // if a user has id, it means it is saved in backend
  id?: number;
  name?: string;
  age?: number;
}

const rootUrl = 'http://localhost:3000/users';

// User is a Model but decides how, and what Attributes,Eventing, and Sync classes to use
export class User extends Model<UserProps> {
  // new User instances will be created via buildUser method so
  // composition classes are also instantiated, and a fully working User instance is returned which has all the functionality of Model class
  static buildUser(attrs: UserProps): User {
    return new User(
      // this satisfies the constructor of the Model class so methods defined in Model class can be used by the User instance
      new Attributes<UserProps>(attrs),
      new Eventing(),
      new ApiSync<UserProps>(rootUrl)
    );
  }

  static buildUserCollection(): Collection<User, UserProps> {
    return new Collection<User, UserProps>(rootUrl, (json: UserProps) =>
      User.buildUser(json)
    );
  }

  setRandomAge(): void {
    const age = Math.round(Math.random() * 100);
    this.set({ age: age });
  }
}
