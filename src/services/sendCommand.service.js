import axios from "axios";

export const postEssCommand = async (deviceMac, command, value) => {
    try {
        const response = await axios.post("/switches/send-command", {
            "mac": deviceMac,
            [command]: value,
        });
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const essCommandService = async (deviceMac, data) => {
    try {
        const response = await axios.post("/switches/send-command", {
            "mac": deviceMac,
            ...data
        });
    } catch (error) {
        throw error?.response?.data;
    }
}

export const postTgsCommand = async (deviceMac, command, value) => {
    try {
        const response = await axios.post("/blowers/send-command", {
            "mac": deviceMac,
            "deviceType": "TGS",
            [command]: value,
        });
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const tgsCommandService = async (deviceMac, data) => {
    try {
        const response = await axios.post("/blowers/send-command", {
            "mac": deviceMac,
            "deviceType": "TGS",
            ...data
        });
    } catch (error) {
        throw error?.response?.data;
    }
}

export const postTesCommand = async (deviceMac, command, value) => {
    try {
        const response = await axios.post("/blowers/send-command", {
            "mac": deviceMac,
            "deviceType": "TES",
            [command]: value,
        });
        return response?.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const tesCommandService = async (deviceMac, data) => {
    try {
        const response = await axios.post("/blowers/send-command", {
            "mac": deviceMac,
            "deviceType": "TES",
            ...data
        });
    } catch (error) {
        throw error?.response?.data;
    }
}