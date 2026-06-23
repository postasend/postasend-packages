import type { HttpClient } from '../http.js';
import type {
  AddSuppressionOptions,
  BatchSendOptions,
  EmailChartOptions,
  EmailListOptions,
  EmailStatsOptions,
  SendEmailOptions,
} from '../types.js';

export class EmailsResource {
  constructor(private http: HttpClient) {}

  send(options: SendEmailOptions) {
    return this.http.post('/emails/send', options);
  }

  sendBatch(options: BatchSendOptions) {
    return this.http.post('/emails/batch', options);
  }

  list(options: EmailListOptions = {}) {
    const { page, perPage, status, tag } = options;
    return this.http.get('/emails', { page, perPage, status, tag });
  }

  get(id: string) {
    return this.http.get(`/emails/${id}`);
  }

  stats(options: EmailStatsOptions = {}) {
    return this.http.get('/emails/stats', options as Record<string, string>);
  }

  chart(options: EmailChartOptions) {
    return this.http.get('/emails/chart', options as Record<string, string>);
  }

  listSuppressions(options: { page?: number; perPage?: number } = {}) {
    return this.http.get('/emails/suppressions', options);
  }

  addSuppression(options: AddSuppressionOptions) {
    return this.http.post('/emails/suppressions', options);
  }

  removeSuppression(email: string) {
    return this.http.delete(`/emails/suppressions/${encodeURIComponent(email)}`);
  }
}
