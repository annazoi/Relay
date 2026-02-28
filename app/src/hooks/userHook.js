import Axios from "axios";
import { API_URL } from "../constants";
import { useState } from "react";

export const useUserHook = () => {
  const [userError, setError] = useState();
  const [loading, setLoading] = useState(false);

  const getUser = async (userId) => {
    try {
      setLoading(true);
      const response = await Axios.get(`${API_URL}users/${userId}`);
      setLoading(false);
      if (response?.data?.user) {
        return response.data.user;
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setLoading(false);
      setError("User Not Found");
    }
  };

  const updateUser = async (userId, data) => {
    try {
      setLoading(true);
      const response = await Axios.put(`${API_URL}users/${userId}`, data);
      setLoading(false);
      if (response?.data?.user) {
        return response.data.user;
      }
    } catch (err) {
      setLoading(false);
      console.log("Could not update User", err);
      setError("User could not updated");
    }
  };
  return {
    getUser,
    updateUser,
    userError,
    loading,
  };
};
