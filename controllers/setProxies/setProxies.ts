import { DocumentType } from '@typegoose/typegoose';
import { User } from '../../models';

class ProxiesUpdateError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ProxiesUpdateError';
  }
}

const setProxies = (user: DocumentType<User>, proxies: string[]) => {
  const proxiesUpdateError = (error: any) => {
    const errorMessage = 'Write error while updating proxies data.';
    throw new ProxiesUpdateError(errorMessage);
  };

  user.proxies = { data: proxies };
  return user.save().catch(proxiesUpdateError);
};

export default setProxies;
export { ProxiesUpdateError };
