export class Attributes<T> {
  constructor(private data: T) {}

  // type of the parameter 'key' this function receives will be of type the key of the Type T corresponding to the 'key' argument
  // the type constraint of <K extends keyof T> basically means any K typed variable must be present inside T object type.

  // for instance T is interface with {id;name;value;} then K has to be 'id', 'name', 'value'
  // so key argument to get function has to be what type that specific key was declared to be

  // return type of T[K] means returned value will be an object that matches T[K] key-value pair type
  // <K extends keyof T> restricts argument names(i.e. 'id', 'age' etc), T[K] gives us the return type corresponding to the
  // argument name(K) type in T for instance id is number etc
  get = <K extends keyof T>(key: K): T[K] => {
    return this.data[key];
  };

  // Reason to use Bound function with get:
  // we specifically use an arrow function with the get method, so when a class that is using Attributes for composition,
  // and wants to direct passthrough of its methods like user.get('id'), 'this' keyword correctly refers to the data inside here

  set(update: T): void {
    Object.assign(this.data, update);
  }

  // returns all the data
  getAll(): T {
    return this.data;
  }
}

// // Not a variable declarition, it is a type that is 'stephen'
// type BestName = 'stephen';

// const printName = (name: BestName): void => {};

// Test code!

// const attrs = new Attributes<UserProps>({
//   id: 5,
//   age: 20,
//   name: 'asadas',
// });

// const name = attrs.get('name');
// const age = attrs.get('age');
// const id = attrs.get('id');
