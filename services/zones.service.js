import axios from 'axios';

export const getEssZones = async (params) => {
  try {
    const response = await axios.get('/get-zones/switches', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTgsZones = async (params) => {
  try {
    const response = await axios.get('/get-zones/blowers', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTesZones = async (params) => {
  try {
    const response = await axios.get('/get-zones/blowers', { params:{
      type:"TES",
      ...params
    } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadSiteMapService = async (
  zoneId,
  switchType,
  siteMapArray,
  specificZoneId
) => {
  try {
    const response = await axios.patch(`/zones/${zoneId}`, {
      ...(switchType === 'ess' && {
        site_maps_ESS: siteMapArray,
      }),
      ...(switchType === 'tes' && {
        site_maps_TES: siteMapArray,
      }),
      ...(switchType === 'tgs' && {
        site_maps_TGS: siteMapArray,
      }),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
