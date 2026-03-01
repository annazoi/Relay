import Axios from "axios";
import { API_URL } from "../constants";
import { useState } from "react";

interface AuthResponse {
  token: string;
  userId: string;
  image?: string;
  message?: string;
}

export const useAuthHook = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<AuthResponse>();

  const loginUser = async (loginData: any) => {
    try {
      setLoading(true);
      setError(undefined);
      const response = await Axios.post<AuthResponse>(`${API_URL}auth/login`, loginData);
      setLoading(false);
      setData(response.data);
    } catch (err: any) {
      setLoading(false);
      const message = err.response?.data?.message;
      setError(message || "Could not login User");
    }
  };

  const registerUser = async (registerData: any) => {
    try {
      setLoading(true);
      setError(undefined);
      const response = await Axios.post<AuthResponse>(`${API_URL}auth/register`, registerData);
      setLoading(false);
      setData(response.data);
    } catch (err: any) {
      setLoading(false);
      const message = err.response?.data?.message;
      setError(message || "Could not create user");
    }
  };

  return {
    loginUser,
    registerUser,
    loading,
    error,
    data,
  };
};
