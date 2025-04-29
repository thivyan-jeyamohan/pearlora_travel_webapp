import axios from 'axios';
import { API_URL } from './config';

const paymentService = {
  getAllPayments: () => {
    return axios.get(`${API_URL}/payments`);
  },

  getPayment: (id) => {
    return axios.get(`${API_URL}/payments/${id}`);
  },

  createPayment: (paymentData) => {
    return axios.post(`${API_URL}/payments`, paymentData);
  },

  updatePayment: (id, paymentData) => {
    return axios.put(`${API_URL}/payments/${id}`, paymentData);
  },

  deletePayment: (id) => {
    return axios.delete(`${API_URL}/payments/${id}`);
  }
};

export { paymentService };