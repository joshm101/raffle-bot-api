import mockingoose from 'mockingoose';
import { UserModel } from '../models';

const mockUserQueryResult = {
  firstName: 'foo',
  lastName: 'bar',
  profiles: [],
  proxies: { data: [] },
  settings: { captchaAPIs: [] }
};

const getMockUser = async () => {
  const findByIdMock = () => mockUserQueryResult;
  mockingoose(UserModel).toReturn(findByIdMock, 'findOne');
  const mockUser = await UserModel.findOne().exec();

  return mockUser;
};

export { getMockUser };
