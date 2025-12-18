// src/store/useAuthStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "../utils/api";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL;
// const BASE_URL = import.meta.env.MODE ==="development" ? import.meta.env.VITE_API_URL  : "/";

/* --------------------------- USER SCHEMA TYPE --------------------------- */

export type UserSchemaType = {
  _id: string;
  email: string;
  fullName: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
};

/* ---------------------------- ERROR TYPE ---------------------------- */

export type ErrorSchemaType = {
  status: number;
  type: string;
  message: string;
  stack?: string;
};

/* ----------------------- AUTH FORM TYPES ----------------------- */
export type SignupFormData = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

/* ---------------------------- STORE TYPE ---------------------------- */
type StoreTypes = {
  authUser: UserSchemaType | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: [];
  socket: any;

  checkAuth: () => Promise<{ success: boolean }>;
  signup: (formData: SignupFormData) => Promise<{ success: boolean }>;
  login: (formData: LoginFormData) => Promise<{ success: boolean }>;
  logout: () => Promise<{ success: boolean }>;
  updateProfile: (updateData: any) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
};

/* ---------------------------- STORE IMPLEMENTATION ---------------------------- */

export const useAuthStore = create<StoreTypes>()(
  devtools((set, get) => ({
    authUser: null,
    isCheckingAuth: true,

    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    onlineUsers: [],
    socket: null,

    /* ----------------------- CHECK AUTH ----------------------- */
    checkAuth: async () => {
      set({ isCheckingAuth: true });

      try {
        const { data } = await api.get("/auth/check");

        // User exists
        if (data?.user) {
          set({ authUser: data.user });
          get().connectSocket();
          return { success: true };
        }

        // No user returned
        set({ authUser: null });
        return { success: false };
      } catch (error) {
        console.log(
          "CheckAuthError:",
          (error as AxiosError<{ message: string }>).response?.data?.message
            ? (error as AxiosError<{ message: string }>).response?.data?.message
            : error
        );

        // ❗ DO NOT clear user here unless session invalid
        set({ authUser: null });
        return { success: false };
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    /* ----------------------- SIGNUP ----------------------- */
    signup: async (formData) => {
      set({ isSigningUp: true });

      try {
        const { data } = await api.post("/auth/signup", formData);

        // Store the authenticated user
        set({ authUser: data.user });

        toast.success("Account created successfully!");
        get().connectSocket();
        return { success: true };
      } catch (error) {
        console.log(
          "SignupError:",
          (error as AxiosError<{ message: string }>).response?.data?.message
            ? (error as AxiosError<{ message: string }>).response?.data?.message
            : error
        );
        set({ authUser: null });
        toast.error("Signup failed");
        return { success: false };
      } finally {
        set({ isSigningUp: false });
      }
    },

    /* ----------------------- LOGIN ----------------------- */
    login: async (formData) => {
      set({ isLoggingIn: true });

      try {
        const { data } = await api.post("/auth/login", formData);

        // Save user to store
        set({ authUser: data.user });

        toast.success("Logged in successfully!");

        get().connectSocket();

        return { success: true };
      } catch (error) {
        console.log(
          "loginError:",
          (error as AxiosError<{ message: string }>).response?.data?.message
            ? (error as AxiosError<{ message: string }>).response?.data?.message
            : error
        );

        set({ authUser: null });
        toast.error("Invalid email or password");

        return { success: false };
      } finally {
        set({ isLoggingIn: false });
      }
    },

    /* ----------------------- LOGOUT ----------------------- */
    logout: async () => {
      try {
        await api.post("/auth/logout");

        set({ authUser: null });
        // toast.success("Logged out successfully");

        get().disconnectSocket();
        return { success: true };
      } catch (error) {
        console.log(
          "LogoutError:",
          (error as AxiosError<{ message: string }>).response?.data?.message
            ? (error as AxiosError<{ message: string }>).response?.data?.message
            : error
        );
        toast.error("Logout failed");
        return { success: false };
      }
    },

    /* ----------------------- UPDATE PROFILE ----------------------- */
    updateProfile: async (updateData: any) => {
      set({ isUpdatingProfile: true });
      try {
        console.log(updateData);

        const { data } = await api.put("/user/profile", updateData);
        set({ authUser: data.user });
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.log(
          "UpdateProfileError:",
          (error as AxiosError<{ message: string }>).response?.data?.message
            ? (error as AxiosError<{ message: string }>).response?.data?.message
            : error
        );
        toast.error("Profile update failed");
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    connectSocket: () => {
      const { authUser } = get();

      if (!authUser || get().socket?.connected) return;

      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
      });

      set({ socket: socket });

      // console.log(socket);

      socket.connect();

      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    },

    disconnectSocket: () => {
      if (get().socket?.connected) get().socket?.disconnect();
    },
  }))
);
