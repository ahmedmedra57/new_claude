import axios from "axios";


export const getZonesInfoForSystemIdentificationService = async (params) => {
    try {
        const response = await axios.get('/zones', { params });
        return response.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const createUOSZoneService = async (data) => {
    try {
        const response = await axios.post('/zones', data);
        return response.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const updateUOSZoneService = async (data) => {
    try {
        const response = await axios.put(`/zones/${data.zone_id}`, data);
        return response.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const getSSRsSwitchSizesService = async () => {
    try {
        const response = await axios.get('/ssrs/ssr-switch-sizes');
        return response.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const addSSRsSwitchSizesService = async (value) => {
    try {
        const response = await axios.post('/ssrs/ssr-switch-sizes', { value });
        return response.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const getSSRsRatingListService = async () => {
    try {
        const response = await axios.get('/ssrs/ssr-rating');
        return response.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const addSSRsRatingService = async (value) => {
    try {
        const response = await axios.post('/ssrs/ssr-rating', { value });
        return response.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}