import mockingoose from 'mockingoose';

import setProxies, { ProxiesUpdateError } from './setProxies';

import { UserModel } from '../../models';
import { getMockUser } from '../utils.mocks';

describe('setProxies', () => {
  afterEach(() => {
    mockingoose.resetAll();
  });

  it('throws correct error when proxies data cannot be written to DB', async () => {
    const mockUser = await getMockUser();

    mockingoose(UserModel).toReturn(
      () => Promise.reject(new Error('Write error')),
      'save'
    );
    return expect(() => setProxies(mockUser!, [])).rejects.toThrow(
      ProxiesUpdateError
    );
  });

  it('resolves on write success', async () => {
    const mockUser = await getMockUser();

    mockingoose(UserModel).toReturn(
      () =>
        new Promise((resolve) => {
          resolve();
        }),
      'save'
    );

    return expect(setProxies(mockUser!, [])).resolves.toBeTruthy();
  });
});
