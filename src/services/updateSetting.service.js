import axios from 'axios';

export const updateSwitchSettingService = async (deviceIds, data,testDevices) => {
    try {
        const response = await axios.patch("/switches/update-setting", {
            deviceIds,
            ...data,
            testDevices
        });
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
};

export const updateBlowerSettingService = async (deviceIds, data,testDevices) => {
    try {
        const response = await axios.patch("/blowers/update-setting", {
            deviceIds,
            ...data,
            testDevices
        });
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
};

export const updateDevicesValveService = async (data,testDevices) => {
    try {
        const response = await axios.post("/blowers/open-valve/bulk", data,testDevices);
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
};