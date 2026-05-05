import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import loginService from '../services/login'
import blogService from '../services/blogs'
import {
  getUser,
  saveUser,
  removeUser
} from '../services/persistentUser'
import useNotificationStore from './notification'

const useUserStore = create(devtools((set) =>({
user: null,
actions: {
    initUser: () => {
      const loggedUserJSON = getUser()
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        blogService.setToken(user.token);
        set({ user });
      }
    },
    login: async (credentials) => {
        try {
            const user = await loginService.login(credentials)
            saveUser(user)
            blogService.setToken(user.token);
            set({user})
            useNotificationStore.getState().actions.setNotification(`${user.name} logged in`, "success");
        } catch (error) {
            const msg = error.response?.data?.error || "Wrong credentials";
            useNotificationStore.getState().actions.setNotification(msg, "error");
        }
    },
    logout: () => {
      removeUser()
      set({ user: null });
      useNotificationStore.getState().actions.setNotification("logout successful", "success");
    },
}
})))

export default useUserStore;

export const useUser = () => useUserStore(state => state.user)
export const useUserActions = () => useUserStore(state => state.actions)