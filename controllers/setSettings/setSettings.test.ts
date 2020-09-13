import mockingoose from 'mockingoose';

import setSettings, { SettingsWriteError } from './setSettings';
import { getMockUser } from '../utils.mocks';
import { UserModel, Settings } from '../../models';
import { CAPTCHA_APIs } from '../../constants';

describe('setSettings', () => {
  afterEach(() => {
    mockingoose.resetAll();
  });

  const settings: Settings = {
    discordWebhook: '',
    captchaAPIs: [
      { type: CAPTCHA_APIs.TWO_CAPTCHA, apiKey: 'abc123' }
    ],
    customDelays: { maxDelay: 88, minDelay: 8 }
  };

  it('throws correct error when settings cannot be written to DB', async () => {
    const mockUser = await getMockUser();

    mockingoose(UserModel).toReturn(
      () => Promise.reject(new Error('Write error')),
      'save'
    );

    return expect(() =>
      setSettings(mockUser!, settings)
    ).rejects.toThrow(SettingsWriteError);
  });

  it('resolves on settings write success', async () => {
    const mockUser = await getMockUser();

    mockingoose(UserModel).toReturn(
      () =>
        new Promise((resolve) => {
          resolve();
        }),
      'save'
    );

    return expect(
      setSettings(mockUser!, settings)
    ).resolves.toBeTruthy();
  });
});
