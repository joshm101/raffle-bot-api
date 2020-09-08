import { DocumentType } from '@typegoose/typegoose';
import { User } from '../../models';
import { getUser } from '../utils';

class ProxiesUpdateError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ProxiesUpdateError';
  }
}

const setProxies = (uid: string, proxies: string[]) => {
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

  return getUser(uid).then(updateProxies);
};

export default setProxies;
export { ProxiesUpdateError };
