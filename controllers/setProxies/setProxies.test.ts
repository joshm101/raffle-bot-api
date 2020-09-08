import mockingoose from 'mockingoose';

import setProxies, {
  GetUserError,
  ProxiesUpdateError
} from './setProxies';

import { UserModel } from '../../models';

// mocking "findOne" below corresponds to mocking "findById"

describe('setProxies', () => {
  afterEach(() => {
    mockingoose.resetAll();
  });

  it('throws correct error when user cannot be read from DB', () => {
    const findByIdMock = () => {
      throw new Error('Read error');
    };

    mockingoose(UserModel).toReturn(findByIdMock, 'findOne');
    return expect(() => setProxies('mock-id', [])).rejects.toThrow(
      GetUserError
    );
  });

  it('throws correct error when proxies data cannot be written to DB', () => {
    const mockUserQueryResult = {
      firstName: 'foo',
      lastName: 'bar',
      profiles: [],
      proxies: { data: [] },
      settings: { captchaAPIs: [] }
    };
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
});
