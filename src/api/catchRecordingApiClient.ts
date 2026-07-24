import { APIRequestContext, APIResponse } from '@playwright/test';

export class CatchRecordingApiClient {
  constructor(private readonly request: APIRequestContext) {}

  private authHeaders(token: string): Record<string, string> {
    return { Authorization: `Bearer ${token}` };
  }

  async login(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/signin', {
      data: { username, password },
    });
  }

  async requestWithBearerToken(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    token: string,
    options?: { data?: Record<string, unknown>; headers?: Record<string, string> }
  ): Promise<APIResponse> {
    return this.request.fetch(url, {
      method,
      headers: { ...options?.headers, ...this.authHeaders(token) },
      data: options?.data,
    });
  }

  async getVessels(token: string): Promise<APIResponse> {
    return this.request.get('/vessels', {
      headers: this.authHeaders(token),
    });
  }

  async createCatchRecord(token: string, payload: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post('/catch-records', {
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });
  }

  async getCatchRecord(token: string, id: string): Promise<APIResponse> {
    return this.request.get(`/catch-records/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async healthCheck(): Promise<APIResponse> {
    return this.request.get('/health');
  }
}
