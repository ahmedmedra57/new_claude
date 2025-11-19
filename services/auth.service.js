import axios from 'axios';

export const loginService = async ({ username, password, remember }) => {
  try {
    const response = await axios.post('/login', {
      user: {
        email: username,
        password: password,
        checkLogin: remember,
      },
    });
    return response?.data?.data;
  } catch (error) {
    throw error?.response?.data;
  }
};

export const logoutService = async () => {
  try {
    const response = await axios.post('/logout');
    return response?.data?.data;
  } catch (error) {
    throw error?.response?.data;
  }
};

const axiosInstance = axios.create({
  baseURL: 'https://api.dev.umb-360.com',
  timeout: 1000,
});

export const resetPasswordService = async (userName) => {
  const userInfo = {
    username: userName,
  };

  try {
    const response = await axiosInstance.post('/api/forget-password', userInfo);

    return response?.data?.data;
  } catch (error) {
    throw error?.response?.data;
  }
};

export const contactUsService = async ({ name, email, phone, message }) => {
  const contactData = {
    name,
    email,
    phone,
    message,
  };

  try {
    const response = await axiosInstance.post('/api/contact-us', contactData);

    return response?.data?.data;
  } catch (error) {
    throw error?.response?.data;
  }
};
