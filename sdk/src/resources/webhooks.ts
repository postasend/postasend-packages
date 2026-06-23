import type { HttpClient } from '../http.js';
import type { CreateWebhookOptions, UpdateWebhookOptions } from '../types.js';

export class WebhooksResource {
  constructor(private http: HttpClient) {}

  create(options: CreateWebhookOptions) {
    return this.http.post('/webhooks', options);
  }

  list() {
    return this.http.get('/webhooks');
  }

  get(id: string) {
    return this.http.get(`/webhooks/${id}`);
  }

  update(id: string, options: UpdateWebhookOptions) {
    return this.http.patch(`/webhooks/${id}`, options);
  }

  delete(id: string) {
    return this.http.delete(`/webhooks/${id}`);
  }

  listDeliveries(id: string, options: { page?: number; perPage?: number } = {}) {
    return this.http.get(`/webhooks/${id}/deliveries`, options);
  }
}
