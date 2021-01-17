import axios, { AxiosPromise } from 'axios';

// Sync methods should only do the axios requests to the rootUrl passed in as argument to this Class instance
// We will return a AxiosPromise so whoever calls these Sync methods decide what to do with result of these

interface hasId {
  id?: number;
}

// T extends hasId, so T generic has to be passed in a type that has id (can be optional)
export class ApiSync<T extends hasId> {
  constructor(public rootUrl: string) {}

  fetch(id: number): AxiosPromise {
    return axios.get(`${this.rootUrl}/${id}`);
  }

  save(data: T): AxiosPromise {
    const { id } = data;
    // presence of id means this user exists in database already, and we can make a put request
    if (id) {
      return axios.put(`${this.rootUrl}/${id}`, data);
    } else {
      return axios.post(this.rootUrl, data);
    }
  }
}
