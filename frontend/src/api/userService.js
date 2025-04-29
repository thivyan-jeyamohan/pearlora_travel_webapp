import api from './config';

export const userService = {
  getUser: (id) => api.get(`/users/${id}`),
};