import Axios from "axios";
import { API_URL } from "../constants";
import { useState } from "react";
import { authStore } from "../store/auth";

export const useUserHook = () => {
    const [userError, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { token } = authStore();

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    const getUser = async (userId: string) => {
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

    const updateUser = async (userId: string, data: any) => {
        try {
            setLoading(true);
            const response = await Axios.put(`${API_URL}users/${userId}`, data, config);
            setLoading(false);
            if (response?.data?.user) {
                return response.data.user;
            }
        } catch (err) {
            setLoading(false);
            setError("User could not updated");
        }
    };

    const followUser = async (userId: string) => {
        try {
            await Axios.put(`${API_URL}users/${userId}/follow`, {}, config);
        } catch (err) {
            console.error("Error following user", err);
        }
    };

    const unfollowUser = async (userId: string) => {
        try {
            await Axios.put(`${API_URL}users/${userId}/unfollow`, {}, config);
        } catch (err) {
            console.error("Error unfollowing user", err);
        }
    };

    return {
        getUser,
        updateUser,
        followUser,
        unfollowUser,
        userError,
        loading,
    };
};
