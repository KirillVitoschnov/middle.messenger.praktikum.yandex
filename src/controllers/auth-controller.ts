import {UserType} from '../types';
import { authAPI } from '../api';
import { router } from '../services';
import { store } from '../store';

export class AuthController {
    public getUserAuth() {
        return authAPI
            .getUserAPI()
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    public getUserData() {
        return authAPI
            .getUserAPI()
            .then((data) => {
                store.setState('user', JSON.parse(data));
            })
            .catch((error) => {
                // console.log(error);
                // store.setState('errorMessage', JSON.parse(error.response).reason);
            });
    }

    login(dataForm: UserType) {
        return authAPI
            .loginAPI(dataForm)
            .then(() =>
                authAPI.getUserAPI().then((data) => {
                    store.setState('user', JSON.parse(data));
                    router.go('/messenger');
                }),
            )
            .catch((error) => {
                store.setState('errorMessage', JSON.parse(error.response).reason);
                console.log(store)
                router.go('/');
            });
    }

    signUp(dataForm: UserType) {
        return authAPI
            .signUpAPI(dataForm)
            .then(() =>
                authAPI.getUserAPI().then((data) => {
                    store.setState('user', JSON.parse(data));
                    console.log('data');
                    router.go('/');
                }),
            )
            .catch((error) => {
                console.log('bad', error);
                store.setState('errorMessage', JSON.parse(error.response).reason);
            });
    }

    logout() {
        return authAPI
            .logoutAPI()
            .then(() => {
                setTimeout(() => {
                    store.setState('user', null);
                    router.go('/');
                }, 100);
            })
            .catch((error) => {
                console.log('Logout error', error);
            });
    }

}

export const authController = new AuthController();
