import { DocumentType } from '@typegoose/typegoose';
import { Profile, User } from '../../models';
import { getUser } from '../utils';

class ProfileCreationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ProfileCreationError';
  }
}

const createProfile = (
  user: DocumentType<User>,
  profileInput: Profile
) => {
  const profileCreationError = () => {
    const errorMessage = 'Write error while creating profile.';
    throw new ProfileCreationError(errorMessage);
  };

  const userProfiles = user.profiles;
  const updatedProfiles = [...userProfiles, profileInput];
  user.profiles = updatedProfiles;

  return user.save().catch(profileCreationError);
};

export default createProfile;
export { ProfileCreationError };
