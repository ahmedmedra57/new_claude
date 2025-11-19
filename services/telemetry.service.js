import axios from "axios";

export const getTelemetryService = async (data) => {
    try {
        const deviceIds = data.deviceIds.map((device) => `deviceIds[]=${device}`).join('&');
        const startDate = `&start_date=${data.startDate}`;
        const endDate = `&end_date=${data.endDate}`;
        const category = `&category=${data.category}`;
        const response = axios.get(`/reports/telemetry?${deviceIds}${startDate}${endDate}${category}`);
        return (await response).data;
    } catch (error) {
        throw error?.response?.data;
    }
};

export const getDataConsumptionService = async (data) => {
    try {
        const inhandIds = data.inhandIds.map((inhand) => `inhand_ids[]=${inhand}`).join('&');
        const startDate = `&start_date=${data.startDate}`;
        const endDate = `&end_date=${data.endDate}`;

        const response = await axios.get(`/reports/data-consumption?${inhandIds}${startDate}${endDate}`);
        return response.data;
    } catch (error) {
        throw error?.response?.data;
    }
};