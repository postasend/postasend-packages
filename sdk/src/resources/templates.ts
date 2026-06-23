import type { HttpClient } from '../http.js';
import type { CreateTemplateOptions, ListOptions, UpdateTemplateOptions } from '../types.js';

export class TemplatesResource {
  constructor(private http: HttpClient) {}

  create(options: CreateTemplateOptions) {
    return this.http.post('/templates', options);
  }

  list(options: ListOptions = {}) {
    return this.http.get('/templates', options);
  }

  get(idOrAlias: string) {
    return this.http.get(`/templates/${idOrAlias}`);
  }

  update(idOrAlias: string, options: UpdateTemplateOptions) {
    return this.http.patch(`/templates/${idOrAlias}`, options);
  }

  delete(idOrAlias: string) {
    return this.http.delete(`/templates/${idOrAlias}`);
  }
}
