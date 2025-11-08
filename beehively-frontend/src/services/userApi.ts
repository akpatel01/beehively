import apiClient, { extractAxiosErrorMessage } from "./apiClient";
import type { Post } from "./postApi";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
};

type UserProfileResponse = {
  message: string;
  user: PublicUser;
  posts: Post[];
};

export const getUserProfile = async (id: string) => {
  try {
    const { data } = await apiClient.get<UserProfileResponse>(`/users/${id}`);
    return data;
  } catch (error) {
    throw new Error(extractAxiosErrorMessage(error));
  }
};


