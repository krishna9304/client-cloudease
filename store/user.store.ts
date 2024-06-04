import { create } from 'zustand';

export interface User {
  name: string;
  email: string;
  image: string;
}

export interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useCurrentUser = create<UserStore>((set) => ({
  user: null,
  setUser: (_u: User | null) => {
    if (!_u) return set({ user: null });
    return set({
      user: {
        ..._u,
        image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=' + _u.name,
      },
    });
  },
}));

export interface UserLoaderStore {
  userLoading: boolean;
  setUserLoading: (loading: boolean) => void;
}

export const useUserLoader = create<UserLoaderStore>((set) => ({
  userLoading: true,
  setUserLoading: (userLoading: boolean) => set({ userLoading }),
}));
