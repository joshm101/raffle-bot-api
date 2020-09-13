import mockingoose from 'mockingoose';
import updateProfile, {
  InvalidProfileError,
  WriteProfileUpdateError
} from './updateProfile';
import { UserModel, Profile } from '../../models';
import { getMockUser } from '../utils.mocks';

describe('updateProfile', () => {
  afterEach(() => {
    mockingoose.resetAll();
  });

  it('throws correct error when referenced profile does not exist', async () => {
    const mockUser = await getMockUser();
    const mockProfileId = 'abc123';
    const updates = {};

    return expect(() =>
      updateProfile(mockUser!, mockProfileId, updates)
    ).toThrow(InvalidProfileError);
  });

  it('throws correct error when profile updates cannot be written to DB', async () => {
    const mockUser = await getMockUser();
    const mockProfileId = 'mock-id';
    const updates = {};

    mockingoose(UserModel).toReturn(
      () => Promise.reject(new Error('Write error')),
      'save'
    );

    return expect(() =>
      updateProfile(mockUser!, mockProfileId, updates)
    ).rejects.toThrow(WriteProfileUpdateError);
  });

  it('resolves on profile update success', async () => {
    const mockUser = await getMockUser();
    const mockProfileId = 'mock-id';
    const updates: Partial<Profile> = {
      generalInfo: {
        firstName: 'foo',
        lastName: 'bar',
        name: 'my-profile',
        country: 'USA'
      }
    };

    mockingoose(UserModel).toReturn(
      () =>
        new Promise((resolve) => {
          resolve();
        }),
      'save'
    );

    return expect(
      updateProfile(mockUser!, mockProfileId, updates)
    ).resolves.toBeTruthy();
  });
});
