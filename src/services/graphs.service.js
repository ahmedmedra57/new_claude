import axios from "axios";

export const getGraphService = async (deviceId, graphType) => {
    try {
        const response = await axios.get(`/live-graph?device_mac=${deviceId}&graph_type=${graphType}`);
        return response.data;
    } catch (error) {
        throw error?.response?.data;
    }
};
