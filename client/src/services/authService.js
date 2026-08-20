import api from './api';

export const getProfile = () => api.get('/auth/profile');
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const updateProfileData = (data) => api.put('/auth/profile', data);
