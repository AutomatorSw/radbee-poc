import { test as base } from '@playwright/test';
import { UserAPI } from '../api/UserAPI';

type ApiFixtures = {
  userAPI: UserAPI;
};

export const test = base.extend<ApiFixtures>({
  userAPI: async ({ request }, use) => {
    const userAPI = new UserAPI(request);
    await use(userAPI);
  },
});

export { expect } from '@playwright/test';
