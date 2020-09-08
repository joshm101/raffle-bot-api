import { DocumentType } from '@typegoose/typegoose';
import { UserModel, User } from '../../models';

class GetUserError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'GetUserError';
  }
}

class ProxiesUpdateError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ProxiesUpdateError';
  }
}

const setProxies = (uid: string, proxies: string[]) => {
  const getUser = () => {
    const getUserError = (error: any) => {
      const errorMessage = 'User retrieval error.';
      throw new GetUserError(errorMessage);
    };

    return UserModel.findById(uid).exec().catch(getUserError);
  };

  const updateProxies = (user: DocumentType<User> | null) => {
    if (!user) {
      const errorMessage = 'User is null.';
      throw new ProxiesUpdateError(errorMessage);
    }

    const proxiesUpdateError = (error: any) => {
      const errorMessage = 'Write error while updating proxies data.';
      throw new ProxiesUpdateError(errorMessage);
    };

    user.proxies = { data: proxies };
    return user.save().catch(proxiesUpdateError);
  };

  return getUser().then(updateProxies);
};

export default setProxies;
export { GetUserError, ProxiesUpdateError };
