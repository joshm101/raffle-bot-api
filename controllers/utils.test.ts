import mockingoose from 'mockingoose';
import { UserModel } from '../models';
import { GetUserError } from './types';
import { getUser } from './utils';

describe('getUser', () => {
  afterEach(() => {
    mockingoose.resetAll();
  });

  it('throws correct error when user cannot be read from DB', () => {
    const findByIdMock = () => {
      throw new Error('Read error');
    };

    mockingoose(UserModel).toReturn(findByIdMock, 'findOne');
    return expect(() => getUser('mock-id')).rejects.toThrow(
      GetUserError
    );
  });
});
