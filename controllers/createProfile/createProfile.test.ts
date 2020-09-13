import mockingoose from 'mockingoose';
import createProfile, { ProfileCreationError } from './createProfile';
import { UserModel, Profile } from '../../models';
import { mockUserQueryResult } from '../utils.mocks';

describe('createProfile', () => {
  afterEach(() => {
    mockingoose.resetAll();
  });

  const mockProfileInput: Profile = {
    generalInfo: {
      name: 'test-profile-name',
      firstName: 'Circus',
      lastName: 'Liquor',
      country: 'USA'
    },
    shippingInfo: {
      province: 'California',
      city: 'Los Angeles',
      postalCode: '91601',
      streetAddress: '5600 Vineland Ave'
    }
  };

  it('throws correct error when user query result is null', () => {
    const mockUserQueryResult = null;
    const findByIdMock = () => mockUserQueryResult;

    mockingoose(UserModel).toReturn(findByIdMock, 'findOne');
    return expect(() =>
      createProfile('mock-id', mockProfileInput)
    ).rejects.toThrow(ProfileCreationError);
  });

  it('throws correct error when profile input cannot be written to DB', () => {
    const findByIdMock = () => mockUserQueryResult;

    mockingoose(UserModel).toReturn(findByIdMock, 'findOne');
    mockingoose(UserModel).toReturn(
      () => Promise.reject(new Error('Write error')),
      'save'
    );

    return expect(() =>
      createProfile('mock-id', mockProfileInput)
    ).rejects.toThrow(ProfileCreationError);
  });

  it('resolves on profile creation success', () => {
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
      createProfile('mock-id', mockProfileInput)
    ).resolves.toBeTruthy();
  });
});
