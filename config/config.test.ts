import { getEnvConfig, EnvConfig } from './config';

describe('getEnvConfig', () => {
  it('returns dev environment configuration', () => {
    const expected: EnvConfig = {
      DB_URL: process.env.RAFFLE_BOT_API_DEV_DB_URL || '',
      DB_USER: process.env.RAFFLE_BOT_API_DEV_DB_USER || '',
      DB_PASSWORD: process.env.RAFFLE_BOT_API_DEV_DB_PASSWORD || ''
    };

    const actual = getEnvConfig('dev');
    expect(actual).toEqual(expected);
  });

  it('returns prod environment configuration', () => {
    const expected: EnvConfig = {
      DB_URL: process.env.RAFFLE_BOT_API_PROD_DB_URL || '',
      DB_USER: process.env.RAFFLE_BOT_API_PROD_DB_USER || '',
      DB_PASSWORD: process.env.RAFFLE_BOT_API_PROD_DB_PASSWORD || ''
    };

    const actual = getEnvConfig('production');
    expect(actual).toEqual(expected);
  });
});
