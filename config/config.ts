interface EnvConfig {
  DB_URL: string;
  DB_USER: string;
  DB_PASSWORD: string;
}

const getEnvConfig = (config: string | undefined): EnvConfig => {
  const devConfig: EnvConfig = {
    DB_URL: process.env.RAFFLE_BOT_API_DEV_DB_URL || '',
    DB_USER: process.env.RAFFLE_BOT_API_DEV_DB_USER || '',
    DB_PASSWORD: process.env.RAFFLE_BOT_API_DEV_DB_PASSWORD || ''
  };

  const prodConfig: EnvConfig = {
    DB_URL: process.env.RAFFLE_BOT_API_PROD_DB_URL || '',
    DB_USER: process.env.RAFFLE_BOT_API_DEV_DB_USER || '',
    DB_PASSWORD: process.env.RAFFLE_BOT_API_DEV_DB_PASSWORD || ''
  };

  switch (config) {
    case 'production':
      return prodConfig;
    case 'dev':
    default:
      return devConfig;
  }
};

export { getEnvConfig, EnvConfig };
