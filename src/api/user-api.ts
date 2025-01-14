import {PasswordChangeType, UserType} from '../types';
import * as Service from '../services';

const chatAPIInstance = new Service.HttpClient('https://ya-praktikum.tech/api/v2/user');

export class UserAPI extends Service.BaseAPI {
  updateUserAPI(data: UserType) {
    return chatAPIInstance
      .put('/profile', {
        data: JSON.stringify(data),
        isCredentials: true,
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((data) => {
        console.log('api', data);
        return data;
      });
  }
    changePasswordAPI(data: PasswordChangeType) {
        return chatAPIInstance.put('/password', {
            isCredentials: true,
            headers: {
                'content-type': 'application/json',
            },
            data: JSON.stringify(data),
        });
    }
}

export const userAPI = new UserAPI();
