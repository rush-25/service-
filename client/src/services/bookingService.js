import api from './api';

export const getMyBookings = () => api.get('/bookings');
export const createBooking = (data) => api.post('/bookings', data);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
