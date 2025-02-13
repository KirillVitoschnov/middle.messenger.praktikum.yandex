import { PasswordChangeType, UserType } from '../types';
import * as Service from '../services';

const userAPIInstance = new Service.HttpClient('https://ya-praktikum.tech/api/v2/user');

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
            .then((data) => {
                return data;
            });
    }

    changePasswordAPI(data: PasswordChangeType) {
        return userAPIInstance.put('/password', {
            isCredentials: true,
            headers: {
                'content-type': 'application/json',
            },
            data: JSON.stringify(data),
        });
    }

    updateAvatarAPI(formData: FormData) {
        return userAPIInstance.put('/profile/avatar', {
            isCredentials: true,
            data: formData,
            headers: {},
        });
    }
}

export const userAPI = new UserAPI();
