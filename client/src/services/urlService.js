import api from './api';

export const getUrls = async () => {
  const response = await api.get('/urls');
  return response.data;
};

export const createUrl = async (urlData) => {
  const response = await api.post('/urls', urlData);
  return response.data;
};

export const deleteUrl = async (id) => {
  const response = await api.delete(`/urls/${id}`);
  return response.data;
};

export const getUrlAnalytics = async (id) => {
  const response = await api.get(`/urls/${id}/analytics`);
  return response.data;
};
