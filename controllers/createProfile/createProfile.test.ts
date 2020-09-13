import mockingoose from 'mockingoose';
import createProfile, { ProfileCreationError } from './createProfile';
import { UserModel, Profile } from '../../models';
import { getMockUser } from '../utils.mocks';

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

  it('throws correct error when profile input cannot be written to DB', async () => {
    const mockUser = await getMockUser();
    mockingoose(UserModel).toReturn(
      () => Promise.reject(new Error('Write error')),
      'save'
    );

    return expect(() =>
      createProfile(mockUser!, mockProfileInput)
    ).rejects.toThrow(ProfileCreationError);
  });

  it('resolves on profile creation success', async () => {
    const mockUser = await getMockUser();
    mockingoose(UserModel).toReturn(
      () =>
        new Promise((resolve) => {
          resolve();
        }),
      'save'
    );

    return expect(
      createProfile(mockUser!, mockProfileInput)
    ).resolves.toBeTruthy();
  });
});
