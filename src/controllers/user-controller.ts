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

  updateAvatar(formData: FormData) {
    return userAPI
      .updateAvatarAPI(formData)
      .then((data) => {
        store.setState('user', JSON.parse(data as string));
        console.log('Аватар обновлён', data);
        router.go('/settings');
      })
      .catch((error) => {
        console.error('Ошибка при обновлении аватара', error);
        if (error.response) {
          store.setState('errorMessage', JSON.parse(error.response as string).reason);
        }
        router.go('/profile');
      });
  }

  searchUser(login: string) {
    return userAPI
      .searchUserAPI(login)
      .then((data) => {
        console.log('Результат поиска пользователя:', data);
        store.setState('users', JSON.parse(data as string));
      })
      .catch((error) => {
        console.error('Ошибка при поиске пользователя:', error);
        if (error.response) {
          store.setState('errorMessage', JSON.parse(error.response as string).reason);
        }
      });
  }
}

export const userController = new UserController();
