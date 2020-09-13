import { DocumentType } from '@typegoose/typegoose';
import { Profile, User } from '../../models';
import { getUser } from '../utils';

class ProfileCreationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ProfileCreationError';
  }
}

const createProfile = (uid: string, profileInput: Profile) => {
  const saveProfile = (user: DocumentType<User> | null) => {
    if (!user) {
      const errorMessage = 'User is null.';
      throw new ProfileCreationError(errorMessage);
    }

    const profileCreationError = () => {
      const errorMessage = 'Write error while creating profile.';
      throw new ProfileCreationError(errorMessage);
    };

    const userProfiles = user.profiles;
    const updatedProfiles = [...userProfiles, profileInput];
    user.profiles = updatedProfiles;

    return user.save().catch(profileCreationError);
  };

  return getUser(uid).then(saveProfile);
};

export default createProfile;
export { ProfileCreationError };
