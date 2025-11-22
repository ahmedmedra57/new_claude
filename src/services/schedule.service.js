import axios from 'axios';

export const getScheduleForDeviceService = async (deviceId, deviceType) => {
    try {
        const response = await axios.get(`/schedules?deviceId=${deviceId}&deviceType=${deviceType}`);
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const createScheduleService = async (data) => {
    try {
        const response = await axios.post("/schedules/", data);
        return response?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const updateScheduleService = async (id, data) => {
    try {
        const response = await axios.patch(`/schedules/${id}`, data);
        return response?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const deleteScheduleService = async (id) => {
    try {
        const response = await axios.delete(`/schedules/${id}`);
        return response?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}
