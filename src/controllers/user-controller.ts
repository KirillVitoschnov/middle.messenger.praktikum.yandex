import { PasswordChangeType, UserType } from '../types';
import { userAPI } from '../api';
import { router } from '../services';
import { store } from '../store';

export class UserController {
    updateUserProfile(dataForm: UserType) {
        return userAPI
            .updateUserAPI(dataForm)
            .then((data) => {
                store.setState('user', JSON.parse(data as string));
                console.log('controller', data);
                router.go('/settings');
            })
            .catch((error) => {
                console.log('controller bad', error);
                store.setState('errorMessage', JSON.parse(error.response as string).reason);
                router.go('/');
            });
    }

    changePassword(dataForm: PasswordChangeType) {
        return userAPI
            .changePasswordAPI(dataForm)
            .then(() => {
                store.setState('successMessage', 'Password changed successfully');
                router.go('/profile');
            })
            .catch((error) => {
                store.setState('errorMessage', JSON.parse(error.response as string).reason);
            });
    }
}

export const userController = new UserController();
