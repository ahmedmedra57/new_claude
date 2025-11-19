import axios from "axios";

export const updateSwitchesMasterControlService = async (deviceIds, deviceType, data) => {
    try {
        const response = await axios.post("/switches/master-control", {
            deviceIds,
            deviceType,
            ...data
        });
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const updateBlowersMasterControlService = async (deviceIds, deviceType, data) => {
    try {
        const response = await axios.post("/blowers/master-control", {
            deviceIds,
            deviceType,
            ...data
        });
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}