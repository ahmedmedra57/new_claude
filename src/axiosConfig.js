import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        const isAmazonS3Upload = config.url.includes(process.env.REACT_APP_AMAZON_S3_URL);
        if (!isAmazonS3Upload && token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem("loginTime");
            window.location.href = '/login';
        }
        throw error;
    }
);
