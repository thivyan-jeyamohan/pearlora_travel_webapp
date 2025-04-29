import axios from 'axios';
import { API_URL } from './config';

const paymentMethodService = {
  getAllPaymentMethods: () => {
    return axios.get(`${API_URL}/payment-methods`);
  },

  getPaymentMethod: (id) => {
    return axios.get(`${API_URL}/payment-methods/${id}`);
  },

  createPaymentMethod: (methodData) => {
    return axios.post(`${API_URL}/payment-methods`, methodData);
  },

  updatePaymentMethod: (id, methodData) => {
    return axios.put(`${API_URL}/payment-methods/${id}`, methodData);
  },

  deletePaymentMethod: (id) => {
    return axios.delete(`${API_URL}/payment-methods/${id}`);
  }
};

export { paymentMethodService };