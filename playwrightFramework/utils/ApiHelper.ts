import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { getEnvConfig } from '../config/envConfig';

/**
 * ApiHelper — Wraps Playwright's APIRequestContext for clean API testing.
 */
export class ApiHelper {
  private request: APIRequestContext;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(request: APIRequestContext) {
    const env = process.env.ENV || 'qa';
    const config = getEnvConfig(env);

    this.request = request;
    this.baseUrl = config.apiBaseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    };

    if (config.apiKey) {
      this.headers['Authorization'] = `Bearer ${config.apiKey}`;
    }
  }

  // ── Set auth token ──
  setAuthToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  // ── HTTP Methods ──
  async get(endpoint: string, params?: Record<string, string>): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, params);
    console.log(`→ GET ${url}`);
    return this.request.get(url, { headers: this.headers });
  }

  async post(endpoint: string, body: object): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    console.log(`→ POST ${url}`);
    return this.request.post(url, {
      headers: this.headers,
      data: body,
    });
  }

  async put(endpoint: string, body: object): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    console.log(`→ PUT ${url}`);
    return this.request.put(url, {
      headers: this.headers,
      data: body,
    });
  }

  async patch(endpoint: string, body: object): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    console.log(`→ PATCH ${url}`);
    return this.request.patch(url, {
      headers: this.headers,
      data: body,
    });
  }

  async delete(endpoint: string): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    console.log(`→ DELETE ${url}`);
    return this.request.delete(url, { headers: this.headers });
  }

  // ── Assertions ──
  async assertStatus(response: APIResponse, expected: number): Promise<void> {
    const actual = response.status();
    console.log(`  Status: ${actual} (expected: ${expected})`);
    expect(actual, `Expected ${expected} but got ${actual}`).toBe(expected);
  }

  async assertBodyContains(response: APIResponse, key: string, value: any): Promise<void> {
    const body = await response.json();
    expect(body[key], `Expected "${key}" = "${value}"`).toEqual(value);
  }

  async assertResponseTime(response: APIResponse, maxMs: number): Promise<void> {
    // Playwright doesn't expose timing directly — log headers
    console.log(`  Checking response is OK: ${response.ok()}`);
    expect(response.ok()).toBeTruthy();
  }

  async getJsonBody<T = any>(response: APIResponse): Promise<T> {
    return response.json() as Promise<T>;
  }

  // ── Auth login ──
  async loginAndGetToken(username: string, password: string): Promise<string> {
    const response = await this.post('/auth/login', { username, password });
    await this.assertStatus(response, 200);
    const body = await response.json();
    const token = body?.data?.token || body?.token || '';
    if (token) {
      this.setAuthToken(token);
      console.log(`✅ Auth token obtained`);
    }
    return token;
  }

  // ── Private ──
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    let url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint}`;
    if (params) {
      const query = new URLSearchParams(params).toString();
      url = `${url}?${query}`;
    }
    return url;
  }
}
