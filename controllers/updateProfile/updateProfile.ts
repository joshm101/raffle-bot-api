import { DocumentType } from '@typegoose/typegoose';
import { User, Profile } from '../../models';

class InvalidProfileError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'InvalidProfileError';
  }
}

class WriteProfileUpdateError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'WriteProfileUpdateError';
  }
}

const updateProfile = (
  user: DocumentType<User>,
  profileId: string,
  updates: Partial<Profile>
) => {
  const profileWriteError = () => {
    throw new WriteProfileUpdateError(
      'Could not write profile updates.'
    );
  };

  const { generalInfo = {}, shippingInfo = {} } = updates;

  const profileIndex = user.profiles.findIndex(
    (profile) => profile.id === profileId
  );
  const profile = user.profiles[profileIndex];

  if (!profile) {
    throw new InvalidProfileError('Profile does not exist.');
  }

  const updatedGeneralInfo = {
    ...profile.generalInfo,
    ...generalInfo
  };
  const updatedShippingInfo = {
    ...profile.shippingInfo,
    ...shippingInfo
  };

  user.profiles[profileIndex].generalInfo = updatedGeneralInfo;
  user.profiles[profileIndex].shippingInfo = updatedShippingInfo;

  return user.save().catch(profileWriteError);
};

export default updateProfile;
export { InvalidProfileError, WriteProfileUpdateError };
