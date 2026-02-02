import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'sfkray4';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const chatAPI = {
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chat', {
        message: message,
      });
      return response.data;
    } catch (error) {
      console.error('Chat API Error:', error);
      throw new Error(
        error.response?.data?.detail || 
        'Failed to get response. Please check if the backend server is running.'
      );
    }
  },
};

export default api;