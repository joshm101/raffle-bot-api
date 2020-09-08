import { prop, getModelForClass } from '@typegoose/typegoose';

class ProfileGeneralInfo {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public firstName!: string;

  @prop({ required: true })
  public lastName!: string;

  @prop({ required: true })
  public country!: string;
}

class ProfileShippingInfo {
  @prop({ required: true })
  public province!: string;

  @prop({ required: true })
  public city!: string;

  @prop({ required: true })
  public postalCode!: string;

  @prop({ required: true })
  public streetAddress!: string;
}

class Profile {
  @prop({ required: true })
  public generalInfo!: ProfileGeneralInfo;

  @prop({ required: true })
  public shippingInfo!: ProfileShippingInfo;
}

class EmailGroup {
  @prop({ required: true })
  public name!: string;

  @prop()
  public data: string[] = [];
}

class Proxies {
  @prop()
  public data: string[] = [];
}

class CaptchaAPI {
  @prop()
  public type?: string;

  @prop()
  public apiKey?: string;
}

class CustomDelays {
  @prop()
  public maxDelay!: number;

  @prop()
  public minDelay!: number;
}

class Settings {
  @prop()
  public discordWebhook?: string;

  @prop()
  public captchaAPIs: CaptchaAPI[] = [];

  @prop()
  public customDelays: CustomDelays = { maxDelay: 77, minDelay: 7 };
}

class User {
  @prop({ required: true })
  public firstName!: string;

  @prop({ required: true })
  public lastName!: string;

  @prop({ required: true })
  public profiles!: Profile[];

  @prop()
  public emailGroups?: EmailGroup[] = [];

  @prop({ required: true })
  public proxies!: Proxies;

  @prop({ required: true })
  public settings!: Settings;
}

const UserModel = getModelForClass(User);

export default UserModel;
export { User, EmailGroup };
