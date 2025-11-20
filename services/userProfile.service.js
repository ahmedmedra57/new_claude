import axios from "axios"

export const updateUserProfileService = async (data) => {
  try {
    const response = await axios.post("/update-user", data)
    return response?.data
  } catch (error) {
    throw error?.response?.data.message
  }
}

export const getUserProfileDataService = async () => {
  try {
    const response = await axios.get(`/me`);
    return response?.data?.data;
  } catch (error) {
    throw error?.response?.data;
  }
}