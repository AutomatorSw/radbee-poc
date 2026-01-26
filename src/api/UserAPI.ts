import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseAPI } from './BaseAPI';

export interface User {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

export interface CreateUserPayload {
  name: string;
  job: string;
}

export class UserAPI extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getUsers(page: number = 1): Promise<APIResponse> {
    return await this.get(`/users?page=${page}`);
  }

  async getUserById(userId: number): Promise<APIResponse> {
    return await this.get(`/users/${userId}`);
  }

  async createUser(userData: CreateUserPayload): Promise<APIResponse> {
    return await this.post('/users', {
      data: userData,
    });
  }

  async updateUser(userId: number, userData: Partial<CreateUserPayload>): Promise<APIResponse> {
    return await this.put(`/users/${userId}`, {
      data: userData,
    });
  }

  async patchUser(userId: number, userData: Partial<CreateUserPayload>): Promise<APIResponse> {
    return await this.patch(`/users/${userId}`, {
      data: userData,
    });
  }

  async deleteUser(userId: number): Promise<APIResponse> {
    return await this.delete(`/users/${userId}`);
  }

  async registerUser(email: string, password: string): Promise<APIResponse> {
    return await this.post('/register', {
      data: { email, password },
    });
  }

  async loginUser(email: string, password: string): Promise<APIResponse> {
    return await this.post('/login', {
      data: { email, password },
    });
  }
}
