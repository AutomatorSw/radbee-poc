import { Environment, EnvironmentConfig } from './Environment';
import * as fs from 'fs';
import * as path from 'path';

export class EnvironmentFactory {
  static create(): Environment {
    const environmentName = process.env.ENVIRONMENT || 'dev';
    const configPath = path.join(__dirname, 'data', 'environments.json');
    
    const environmentsData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const config: EnvironmentConfig = environmentsData[environmentName];
    
    if (!config) {
      throw new Error(`Environment configuration for '${environmentName}' not found`);
    }
    
    return new Environment(config);
  }
}
