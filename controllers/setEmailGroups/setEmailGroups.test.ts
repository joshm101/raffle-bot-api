import mockingoose from 'mockingoose';
import setEmailGroups, {
  MalformedDataError,
  EmailGroupsUpdateError
} from './setEmailGroups';

import { UserModel } from '../../models';
import { getMockUser } from '../utils.mocks';

describe('setEmailGroups', () => {
  afterEach(() => {
    mockingoose.resetAll();
  });

  it('throws correct error when any of email groups are malformed', async () => {
    const mockUser = await getMockUser();

    expect(() =>
      setEmailGroups(mockUser!, [{ name: '', data: [] }])
    ).toThrow(MalformedDataError);
  });

  it('throws correct error when email groups data cannot be written to DB', async () => {
    const mockUser = await getMockUser();

    mockingoose(UserModel).toReturn(
      () => Promise.reject(new Error('Write error')),
      'save'
    );

    return expect(() =>
      setEmailGroups(mockUser!, [])
    ).rejects.toThrow(EmailGroupsUpdateError);
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

    return expect(
      setEmailGroups(mockUser!, [])
    ).resolves.toBeTruthy();
  });
});
