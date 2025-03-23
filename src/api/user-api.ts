import { PasswordChangeType, UserType } from '../types';
import * as Service from '../services';
import { BASE_URL } from '../congfig';

const userAPIInstance = new Service.HttpClient(BASE_URL + '/user');

export class UserAPI extends Service.BaseAPI {
  updateUserAPI(data: UserType) {
    return userAPIInstance
      .put('/profile', {
        data: JSON.stringify(data),
        isCredentials: true,
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((data) => data);
  }

  changePasswordAPI(data: PasswordChangeType) {
    return userAPIInstance.put('/password', {
      data: JSON.stringify(data),
      isCredentials: true,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  updateAvatarAPI(formData: FormData) {
    return userAPIInstance.put('/profile/avatar', {
      data: formData,
      isCredentials: true,
      headers: {},
    });
  }

  searchUserAPI(login: string) {
    return userAPIInstance.post('/search', {
      data: JSON.stringify({ login }),
      isCredentials: true,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}

export const userAPI = new UserAPI();
