import api from './config';

export const billService = {
  getAllBills: () => api.get('/bills'),
  getBill: (id) => api.get(`/bills/${id}`),
  getUserBills: (userId) => api.get(`/bills/user/${userId}`),
  createBill: (data) => api.post('/bills', data),
  updateBill: (id, data) => api.put(`/bills/${id}`, data),
  deleteBill: (id) => api.delete(`/bills/${id}`),
  getBillWithUser: (id) => api.get(`/bills/${id}?populate=userId`)
};