import axios from "axios"

export const uploadS3File = async (file) => {
    try {
      const fileType=file?.type
  
      const res = await axios.post(`/get-signed-url`, {
        contentType: fileType,
      })
  
      const blob = new Blob([file], { type: fileType })
      await axios.put(res?.data?.signedUrl, blob, {
        headers: {
          "content-type": fileType,
        },
      })
  
      return res?.data?.url
      
    } catch (error) {
      throw error?.response?.data
    }
  }