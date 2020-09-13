import mockingoose from 'mockingoose';

import setProxies, { ProxiesUpdateError } from './setProxies';

import { UserModel } from '../../models';
import { mockUserQueryResult } from '../utils.mocks';

// mocking "findOne" below corresponds to mocking "findById"

describe('setProxies', () => {
  afterEach(() => {
    mockingoose.resetAll();
  });

  it('throws correct error when proxies data cannot be written to DB', () => {
    const findByIdMock = () => mockUserQueryResult;

    mockingoose(UserModel).toReturn(findByIdMock, 'findOne');
    mockingoose(UserModel).toReturn(
      () => Promise.reject(new Error('Write error')),
      'save'
    );
    return expect(() => setProxies('mock-id', [])).rejects.toThrow(
      ProxiesUpdateError
    );
  });

  it('throws correct error when user query result is null', () => {
    const mockUserQueryResult = null;
    const findByIdMock = () => mockUserQueryResult;

    mockingoose(UserModel).toReturn(findByIdMock, 'findOne');
    return expect(() => setProxies('mock-id', [])).rejects.toThrow(
      ProxiesUpdateError
    );
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

    return expect(setProxies('mock-id', [])).resolves.toBeTruthy();
  });
});
