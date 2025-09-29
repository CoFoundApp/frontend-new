import { create } from "zustand";

export type CurrentUser = {
    myEmail: string;
    myProfile: {
        display_name: string;
        user_id: string;
    }
} | null;

type State = {
    user: CurrentUser;
    setUser: (u: CurrentUser) => void;
    clearUser: () => void;
};

export const useCurrentUser = create<State>((set) => ({
    user: null,
    setUser: (u) => set({ user: u }),
    clearUser: () => set({ user: null }),
}));