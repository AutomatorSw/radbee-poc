export interface EnvironmentConfig {
  baseUrl: string;
  wikiSpacesUrl: string;
  credentials: {
    email: string;
    authMethod: string;
  };
}

export class Environment {
  private config: EnvironmentConfig;

  constructor(config: EnvironmentConfig) {
    this.config = config;
  }

  get baseUrl(): string {
    return this.config.baseUrl;
  }

  get wikiSpacesUrl(): string {
    return this.config.wikiSpacesUrl;
  }

  get fullWikiUrl(): string {
    return `${this.config.baseUrl}${this.config.wikiSpacesUrl}`;
  }

  get userEmail(): string {
    return this.config.credentials.email;
  }

  get authMethod(): string {
    return this.config.credentials.authMethod;
  }
}
