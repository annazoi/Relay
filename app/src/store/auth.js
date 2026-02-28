import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const initialStateValues = {
  isLoggedIn: false,
  token: "",
  userId: "",
};

export const authStore = create()(
  devtools(
    persist(
      (set) => ({
        ...initialStateValues,
        logOut: () => {
          set({
            ...initialStateValues,
          });
        },
        logIn: (payload) =>
          set({
            isLoggedIn: true,
            token: payload.token,
            userId: payload.userId,
          }),
      }),
      {
        name: "auth-storage-client",
      }
    )
  )
);

export const getAuthState = () => {
  return authStore.getState();
};
