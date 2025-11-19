import axios from "axios";

export const bulkUpdateSwitchDeviceService = async (deviceIds, data) => {
    try {
        const response = await axios.post('/switches/send-command/bulk', {
            deviceIds,
            ...data
        });
        return response?.data;
    } catch (error) {
        throw error?.response?.data;
    }
};

export const bulkUpdateBlowerDeviceService = async (deviceIds, deviceType, data) => {
    try {
        const response = await axios.post('/blowers/send-command/bulk', {
            deviceIds,
            deviceType,
            ...data
        });
        return response?.data;
    } catch (error) {
        throw error?.response?.data;
    }
};