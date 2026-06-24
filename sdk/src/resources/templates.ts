import type { HttpClient } from '../http.js';
import type { CreateTemplateOptions, ListOptions, UpdateTemplateOptions } from '../types.js';

export class TemplatesResource {
  constructor(private http: HttpClient) {}

  create(options: CreateTemplateOptions) {
    return this.http.post('/templates', options);
  }

  list(options: ListOptions = {}) {
    const { page, perPage } = options;
    return this.http.get('/templates', { page, perPage });
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
