import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
    isLoggedIn: boolean;
    token: string;
    userId: string;
    image: string;
    logOut: () => void;
    logIn: (payload: { token: string; userId: string; image?: string }) => void;
}

const initialStateValues = {
    isLoggedIn: false,
    token: "",
    userId: "",
    image: "",
};

export const authStore = create<AuthState>()(
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
                        image: payload.image || "",
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
