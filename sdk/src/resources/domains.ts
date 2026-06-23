import type { HttpClient } from '../http.js';

export class DomainsResource {
  constructor(private http: HttpClient) {}

  add(domain: string) {
    return this.http.post('/domains', { domain });
  }

  list() {
    return this.http.get('/domains');
  }

  get(id: string) {
    return this.http.get(`/domains/${id}`);
  }

  verify(id: string) {
    return this.http.post(`/domains/${id}/verify`);
  }

  delete(id: string) {
    return this.http.delete(`/domains/${id}`);
  }
}
