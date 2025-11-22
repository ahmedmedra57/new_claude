import axios from "axios";

export const getDeviceThermocouplesService = async (deviceId) => {
    try {
        const response = await axios.get(`/thermocouples?deviceId=${deviceId}`);
        return response.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
};

export const updateDeviceThermocoupleService = async (deviceId, data) => {
    try {
        const response = await axios.patch(`/thermocouples/${deviceId}`, data);
        return response.data?.data;
    } catch (error) {
        throw error?.response?.data;
    }
};

export const FaultAttendService = async (attendData) => {
    try {
        const response = await axios.post("/attends", attendData);
        return response?.data;
    } catch (error) {
        throw error?.response?.data;
    }
}

export const getFaultAttendService = async (
  fault_type,
  fault_index,
  device_id
) => {
  try {
    const response = await axios.get(
      `/attends?fault_type=${fault_type}&fault_index=${fault_index}&device_id=${device_id}`
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
};