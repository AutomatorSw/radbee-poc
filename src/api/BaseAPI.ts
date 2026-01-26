import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseAPI {
  protected request: APIRequestContext;
  protected baseURL: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseURL = process.env.API_BASE_URL || 'https://dummyjson.com';
  }

  async get(endpoint: string, options?: any): Promise<APIResponse> {
    return await this.request.get(`${this.baseURL}${endpoint}`, options);
  }

  async post(endpoint: string, options?: any): Promise<APIResponse> {
    return await this.request.post(`${this.baseURL}${endpoint}`, options);
  }

  async put(endpoint: string, options?: any): Promise<APIResponse> {
    return await this.request.put(`${this.baseURL}${endpoint}`, options);
  }

  async patch(endpoint: string, options?: any): Promise<APIResponse> {
    return await this.request.patch(`${this.baseURL}${endpoint}`, options);
  }

  async delete(endpoint: string, options?: any): Promise<APIResponse> {
    return await this.request.delete(`${this.baseURL}${endpoint}`, options);
  }

  async validateStatusCode(response: APIResponse, expectedStatus: number): Promise<void> {
    if (response.status() !== expectedStatus) {
      throw new Error(
        `Expected status ${expectedStatus} but got ${response.status()}`
      );
    }
  }

  async getResponseBody(response: APIResponse): Promise<any> {
    return await response.json();
  }

  async getResponseHeaders(response: APIResponse): Promise<any> {
    return response.headers();
  }
}
