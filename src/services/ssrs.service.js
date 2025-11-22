import axios from 'axios';

export const getSSRsForDeviceService = async (deviceId) => {
    try {
        const response = await axios.get(`/ssrs?deviceId=${deviceId}`);
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const getAllAdminHeatersService = async () => {
    try {
        const response = await axios.get(`/heaters/search`);
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const getAdminHeatersService = async (partNumber) => {
    try {
        const response = await axios.get(`/heaters/search?partNumber=${partNumber}`);
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const addAdminHeatersService = async (data) => {
    try {
        const response = await axios.post(`/heaters`, data);
        return response?.data?.data;

    } catch (error) {
        throw error?.response?.data;
    }
}

export const addHeaterToSSRService = async (deviceId, data) => {
    try {
        const response = await axios.post(`/ssrs/${deviceId}/heaters`, data);
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}


export const deleteHeaterFromSSRService = async (deviceId, data) => {
    try {
        const response = await axios.delete(`/ssrs/${deviceId}/heaters`, { data });
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const updateHeaterOfSSRService = async (deviceId, data) => {
    try {
        const response = await axios.patch(`/ssrs/${deviceId}`, data);
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}