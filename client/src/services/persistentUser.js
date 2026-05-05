const LC_KEY = "loggedBlogUser"

export const getUser = () => window.localStorage.getItem(LC_KEY)
export const saveUser = (user) => window.localStorage.setItem(LC_KEY, JSON.stringify(user));
export const removeUser = () => window.localStorage.removeItem(LC_KEY);