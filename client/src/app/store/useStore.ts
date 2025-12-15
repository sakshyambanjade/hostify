'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SearchState {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  superhostOnly: boolean;
  likedProperties: number[];
  isLoggedIn: boolean;
  userEmail: string;
  userAvatar?: string;
  token: string | null;
  searchHistory: string[];
}

export interface StoreActions {
  setLocation: (location: string) => void;
  setCheckIn: (date: string) => void;
  setCheckOut: (date: string) => void;
  setGuests: (guests: number) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setMinRating: (rating: number) => void;
  setSuperhostOnly: (superhostOnly: boolean) => void;
  toggleLike: (propertyId: number) => void;
  isLiked: (propertyId: number) => boolean;
  getLikedProperties: () => number[];
  clearLikes: () => void;
  setLoggedIn: (status: boolean, email?: string, avatar?: string) => void;
  logout: () => void;
  addSearchHistory: (location: string) => void;
  clearSearchHistory: () => void;
  getSearchHistory: () => string[];
  resetSearch: () => void;
}

const DEFAULT_STATE = {
  location: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  superhostOnly: false,
};

const useStore = create<SearchState & StoreActions>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      likedProperties: [],
      isLoggedIn: false,
      userEmail: '',
      userAvatar: undefined,
      token: null,
      searchHistory: [],

      setLocation: (location: string) => set({ location }),
      setCheckIn: (checkIn: string) => set({ checkIn }),
      setCheckOut: (checkOut: string) => set({ checkOut }),
      setGuests: (guests: number) => set({ guests }),
      setMinPrice: (minPrice: number) => set({ minPrice }),
      setMaxPrice: (maxPrice: number) => set({ maxPrice }),
      setMinRating: (minRating: number) => set({ minRating }),
      setSuperhostOnly: (superhostOnly: boolean) => set({ superhostOnly }),

      toggleLike: (propertyId: number) => {
        const likedRaw = get().likedProperties as unknown;
        const liked = Array.isArray(likedRaw) ? likedRaw : [];
        const exists = liked.includes(propertyId);
        const next = exists
          ? liked.filter((id) => id !== propertyId)
          : [...liked, propertyId];
        set({ likedProperties: next });
      },

      isLiked: (propertyId: number) => {
        const likedRaw = get().likedProperties as unknown;
        const liked = Array.isArray(likedRaw) ? likedRaw : [];
        return liked.includes(propertyId);
      },

      getLikedProperties: () => {
        const likedRaw = get().likedProperties as unknown;
        const liked = Array.isArray(likedRaw) ? likedRaw : [];
        return liked;
      },

      clearLikes: () => set({ likedProperties: [] }),

      setLoggedIn: (status: boolean, email: string = '', avatar: string = '') => {
        set({
          isLoggedIn: status,
          userEmail: email,
          userAvatar: avatar,
          token: status ? 'demo-token' : null,
        });
      },

      logout: () => {
        set({
          isLoggedIn: false,
          userEmail: '',
          userAvatar: undefined,
          token: null,
          likedProperties: [],
        });
      },

      addSearchHistory: (location: string) => {
        const value = location.trim();
        if (!value) return;
        const historyRaw = get().searchHistory as unknown;
        const history = Array.isArray(historyRaw) ? historyRaw : [];
        const next = [value, ...history.filter((h) => h !== value)].slice(0, 10);
        set({ searchHistory: next });
      },

      clearSearchHistory: () => set({ searchHistory: [] }),

      getSearchHistory: () => {
        const historyRaw = get().searchHistory as unknown;
        const history = Array.isArray(historyRaw) ? historyRaw : [];
        return history;
      },

      resetSearch: () => set({ ...DEFAULT_STATE }),
    }),
    {
      name: 'hostify-store',
      partialize: (state) => ({
        likedProperties: state.likedProperties,
        isLoggedIn: state.isLoggedIn,
        userEmail: state.userEmail,
        userAvatar: state.userAvatar,
        token: state.token,
        searchHistory: state.searchHistory,
        location: state.location,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        guests: state.guests,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        minRating: state.minRating,
        superhostOnly: state.superhostOnly,
      }),
      version: 3,
      migrate: (persisted: any) => {
        const s: any = { ...persisted };
        if (!Array.isArray(s.likedProperties)) {
          if (s.likedProperties instanceof Set) {
            s.likedProperties = Array.from(s.likedProperties);
          } else {
            s.likedProperties = [];
          }
        }
        if (!Array.isArray(s.searchHistory)) {
          s.searchHistory = [];
        }
        return s;
      },
    },
  ),
);

export default useStore;
