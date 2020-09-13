import mockingoose from 'mockingoose';
import setEmailGroups, {
  MalformedDataError,
  EmailGroupsUpdateError
} from './setEmailGroups';

import { UserModel } from '../../models';
import { mockUserQueryResult } from '../utils.mocks';

describe('setEmailGroups', () => {
  afterEach(() => {
    mockingoose.resetAll();
  });

  it('throws correct error when any of email groups are malformed', () => {
    expect(() =>
      setEmailGroups('mock-uid', [{ name: '', data: [] }])
    ).toThrow(MalformedDataError);
  });

  it('throws correct error when email groups data cannot be written to DB', () => {
    const findByIdMock = () => mockUserQueryResult;

    mockingoose(UserModel).toReturn(findByIdMock, 'findOne');
    mockingoose(UserModel).toReturn(
      () => Promise.reject(new Error('Write error')),
      'save'
    );

    return expect(() =>
      setEmailGroups('mock-id', [])
    ).rejects.toThrow(EmailGroupsUpdateError);
  });

  it('throws correct error when user query result is null', () => {
    const mockUserQueryResult = null;
    const findByIdMock = () => mockUserQueryResult;

    mockingoose(UserModel).toReturn(findByIdMock, 'findOne');
    return expect(() =>
      setEmailGroups('mock-id', [])
    ).rejects.toThrow(EmailGroupsUpdateError);
  });

  it('resolves on write success', () => {
    const findByIdMock = () => mockUserQueryResult;

    mockingoose(UserModel).toReturn(findByIdMock, 'findOne');
    mockingoose(UserModel).toReturn(
      () =>
        new Promise((resolve) => {
          resolve();
        }),
      'save'
    );

    return expect(
      setEmailGroups('mock-id', [])
    ).resolves.toBeTruthy();
  });
});
