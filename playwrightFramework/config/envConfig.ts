import * as fs from 'fs';
import * as path from 'path';

export interface EnvConfig {
  env:          string;
  baseUrl:      string;
  apiBaseUrl:   string;
  apiKey:       string;
  username:     string;
  password:     string;
  dbUrl?:       string;
  timeoutMs:    number;
}

// ── Load .env.qa or .env.stage ──
function loadEnvFile(env: string): void {
  const envFilePath = path.resolve(process.cwd(), `env/.env.${env}`);
  if (!fs.existsSync(envFilePath)) {
    console.warn(`⚠️  Env file not found: ${envFilePath}. Using defaults.`);
    return;
  }
  const lines = fs.readFileSync(envFilePath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...valueParts] = trimmed.split('=');
    if (key && !process.env[key.trim()]) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  }
  console.log(`✅ Loaded: ENV/.env.${env}`);
}

export function getEnvConfig(env: string): EnvConfig {
  loadEnvFile(env);

  const configs: Record<string, EnvConfig> = {

    // ════════════════════════════
    // QA Environment
    // ════════════════════════════
    qa: {
      env:        'qa',
      baseUrl:    process.env.BASE_URL    || 'https://opensource-demo.orangehrmlive.com',
      apiBaseUrl: process.env.API_BASE_URL|| 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2',
      apiKey:     process.env.API_KEY     || '',
      username:   process.env.APP_USERNAME    || 'Admin',
      password:   process.env.APP_PASSWORD    || 'admin123',
      timeoutMs:  30_000,
    },

    // ════════════════════════════
    // Staging Environment
    // ════════════════════════════
    stage: {
      env:        'stage',
      baseUrl:    process.env.BASE_URL    || 'https://staging.orangehrm.company.com',
      apiBaseUrl: process.env.API_BASE_URL|| 'https://staging-api.orangehrm.company.com/api/v2',
      apiKey:     process.env.API_KEY     || '',
      username:   process.env.APP_USERNAME    || 'stage_admin',
      password:   process.env.APP_PASSWORD    || 'stage_pass',
      timeoutMs:  45_000,
    },
  };

  const config = configs[env];
  if (!config) {
    throw new Error(`Unknown environment: "${env}". Valid options: qa, stage`);
  }

  console.log(`✅ Environment loaded: ${env.toUpperCase()} → ${config.baseUrl}`);
  return config;
}
