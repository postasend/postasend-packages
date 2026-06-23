import type { HttpClient } from '../http.js';
import type { CreateSenderOptions } from '../types.js';

export class SendersResource {
  constructor(private http: HttpClient) {}

  create(options: CreateSenderOptions) {
    return this.http.post('/senders', options);
  }

  list() {
    return this.http.get('/senders');
  }

  get(id: string) {
    return this.http.get(`/senders/${id}`);
  }

  delete(id: string) {
    return this.http.delete(`/senders/${id}`);
  }
}
