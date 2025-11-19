import axios from "axios";

export const freezeSwitchDeviceService = async (freezeValue, deviceId, userId) => {
    try {
        const response = await axios.patch(`/switches/update-device/${deviceId}`, {
            freeze: freezeValue,
            freeze_by: userId,
        });
        return response?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const freezeBlowerDeviceService = async (freezeValue, deviceId, userId, deviceType) => {
    try {
        const response = await axios.patch(`/blowers/update-device/${deviceId}`, {
            freeze: freezeValue,
            deviceType,
            ...(deviceType === 'TGS' && { freeze_by: userId }),
            ...(deviceType === 'TES' && { e_freeze_by : userId }),
        });
        return response?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}