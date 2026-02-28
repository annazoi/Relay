import { useState } from "react";
import { API_URL } from "../constants";
import Axios from "axios";
import { authStore } from "../store/auth";

export const usePostHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = authStore((store) => store);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const createPost = async (data) => {
    try {
      setLoading(true);
      const response = await Axios.post(`${API_URL}posts`, data, config);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
    }
  };

  const getPosts = async (creatorId = "") => {
    try {
      setLoading(true);
      let url = `${API_URL}posts`;
      if (creatorId) {
        url = url + `?creatorId=${creatorId}`;
      }
      const response = await Axios.get(url);
      setLoading(false);
      if (response?.data?.posts) {
        return response.data.posts;
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setError("Posts Not Found Yet");
    }
  };

  const getPost = async (postId) => {
    try {
      setLoading(true);
      const response = await Axios.get(`${API_URL}posts/${postId}`);
      setLoading(false);
      if (response?.data?.post) {
        return response.data.post;
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setError("Post Not Found");
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await Axios.delete(`${API_URL}posts/${postId}`, config);
      if (response?.data?.deletedCount === 1) {
        return {
          deleted: true,
        };
      } else {
        return {
          deleted: false,
        };
      }
    } catch (error) {
      return {
        deleted: false,
      };
    }
  };

  const createComment = async (data, postId) => {
    try {
      setLoading(true);
      const response = await Axios.post(
        `${API_URL}posts/${postId}/comments`,
        data,
        config
      );
      setLoading(false);

      return {
        message: "ok",
        data: response.data,
      };
    } catch (err) {
      setLoading(false);
      return {
        message: "Could not create Comment",
        data: null,
      };
    }
  };

  return {
    createPost,
    getPosts,
    getPost,
    deletePost,
    createComment,
    loading,
    error,
  };
};
