import { DocumentType } from '@typegoose/typegoose';
import { User, Settings } from '../../models';

class SettingsWriteError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'SettingsWriteError';
  }
}

const setSettings = (
  user: DocumentType<User>,
  settings: Settings
) => {
  const settingsWriteError = () => {
    const errorMessage = 'Could not write settings.';
    throw new SettingsWriteError(errorMessage);
  };

  user.settings = settings;
  return user.save().catch(settingsWriteError);
};

export default setSettings;
export { SettingsWriteError };
