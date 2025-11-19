import axios from "axios";

export const getAuditTrailService = async (filter, limit = 1000) => {
    try {
        const response = await axios.post('/audits/search', {
            limit,
            offset: 0,
            filter
        });
        return response.data?.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const getCommandNumberService = async (actionType) => {
    try {
        const response = await axios.get(`/audits/command-number?actionType=${actionType}`);
        return response.data?.commandNumber;
    } catch (error) {
        throw error.response?.data;
    }
}

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`/users`);
    return response.data?.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const postAuditTrailLogService = async (data) => {
    try {
        const response = await axios.post('/audits/', data);
        return response.data?.data;
    } catch (error) {
        throw error.response?.data;
    }
};