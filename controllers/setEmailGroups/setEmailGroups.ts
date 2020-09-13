import { DocumentType } from '@typegoose/typegoose';
import { User, EmailGroup } from '../../models';
import { getUser } from '../utils';

class MalformedDataError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'MalformedDataError';
  }
}

class EmailGroupsUpdateError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'EmailGroupsUpdateError';
  }
}

const setEmailGroups = (
  user: DocumentType<User>,
  emailGroups: EmailGroup[]
) => {
  const validateEmailGroups = () => {
    const invalidEmailGroup = (emailGroup: EmailGroup) => {
      if (!emailGroup.name.length) {
        return true;
      }

      return false;
    };

    const invalidEmailGroups = emailGroups.filter(invalidEmailGroup);

    if (invalidEmailGroups.length) {
      const errorMessage = 'Email groups must have names.';
      throw new MalformedDataError(errorMessage);
    }
  };

  validateEmailGroups();

  const emailGroupsUpdateError = () => {
    const errorMessage =
      'Write error while updating email groups data.';
    throw new EmailGroupsUpdateError(errorMessage);
  };

  user.emailGroups = emailGroups;
  return user.save().catch(emailGroupsUpdateError);
};

export default setEmailGroups;
export { MalformedDataError, EmailGroupsUpdateError };
