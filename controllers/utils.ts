import { UserModel } from '../models';
import { GetUserError } from './types';

const getUser = (uid: string) => {
  const getUserError = (error: any) => {
    const errorMessage = 'User retrieval error.';
    throw new GetUserError(errorMessage);
  };

  return UserModel.findById(uid).exec().catch(getUserError);
};

export { getUser };
