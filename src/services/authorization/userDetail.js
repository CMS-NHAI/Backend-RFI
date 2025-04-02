import axios from 'axios';
export const userDetail = async (url, token) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Error while fetching data");
    }
  };