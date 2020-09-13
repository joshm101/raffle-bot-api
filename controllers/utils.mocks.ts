import mockingoose from 'mockingoose';
import { UserModel, User, Profile } from '../models';

const mockUserQueryResult: User = {
  firstName: 'foo',
  lastName: 'bar',
  profiles: [
    {
      id: 'mock-id',
      generalInfo: {
        name: 'test-profile-name',
        firstName: 'Circus',
        lastName: 'Liquor',
        country: 'USA'
      },
      shippingInfo: {
        province: 'California',
        city: 'Los Angeles',
        postalCode: '91601',
        streetAddress: '5600 Vineland Ave'
      }
    }
  ],
  proxies: { data: [] },
  settings: {
    captchaAPIs: [],
    customDelays: { maxDelay: 77, minDelay: 7 }
  }
};

const getMockUser = async () => {
  const findByIdMock = () => mockUserQueryResult;
  mockingoose(UserModel).toReturn(findByIdMock, 'findOne');
  const mockUser = await UserModel.findOne().exec();

  return mockUser;
};

export { getMockUser };
