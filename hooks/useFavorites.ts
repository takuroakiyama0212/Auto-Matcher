import { useState, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { Car } from "@/data/cars";
import * as SecureStore from "expo-secure-store";
import { setFavoritesUserCallback } from "./useGoogleAuth";

// ユーザーIDごとにお気に入りを管理
const favoritesByUser: Map<string, Car[]> = new Map();
let listeners: Set<() => void> = new Set();
let currentUserId: string | null = null;

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function getStorageKey(userId: string): string {
  return `favorites_${userId}`;
}

async function loadFavoritesFromStorage(userId: string): Promise<Car[]> {
  try {
    const key = getStorageKey(userId);
    let stored: string | null = null;
    
    if (Platform.OS === "web") {
      stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    } else {
      try {
        stored = await SecureStore.getItemAsync(key);
      } catch (error) {
        console.warn("Failed to load from SecureStore:", error);
      }
    }
    
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load favorites:", error);
  }
  return [];
}

async function saveFavoritesToStorage(userId: string, favorites: Car[]): Promise<void> {
  try {
    const key = getStorageKey(userId);
    const json = JSON.stringify(favorites);
    
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, json);
      }
    } else {
      try {
        await SecureStore.setItemAsync(key, json);
      } catch (error) {
        console.warn("Failed to save to SecureStore:", error);
      }
    }
  } catch (error) {
    console.error("Failed to save favorites:", error);
  }
}

async function clearFavoritesFromStorage(userId: string): Promise<void> {
  try {
    const key = getStorageKey(userId);
    
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } else {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.warn("Failed to delete from SecureStore:", error);
      }
    }
  } catch (error) {
    console.error("Failed to clear favorites:", error);
  }
}

export function useFavorites() {
  const [, forceUpdate] = useState({});

  const subscribe = useCallback(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  useState(() => {
    const unsubscribe = subscribe();
    return unsubscribe;
  });

  // 現在のユーザーのお気に入りを取得
  const getCurrentFavorites = useCallback((): Car[] => {
    if (!currentUserId) return [];
    return favoritesByUser.get(currentUserId) || [];
  }, []);

  // ユーザーを設定（ログイン時）
  const setUser = useCallback(async (userId: string | null) => {
    // 前のユーザーのお気に入りを保存
    if (currentUserId) {
      const currentFavorites = favoritesByUser.get(currentUserId) || [];
      await saveFavoritesToStorage(currentUserId, currentFavorites);
    }

    currentUserId = userId;

    if (userId) {
      // 新しいユーザーのお気に入りを読み込む
      const savedFavorites = await loadFavoritesFromStorage(userId);
      favoritesByUser.set(userId, savedFavorites);
    } else {
      // ログアウト時は現在のユーザーのお気に入りをクリア
      if (currentUserId) {
        favoritesByUser.delete(currentUserId);
        await clearFavoritesFromStorage(currentUserId);
      }
    }

    notifyListeners();
  }, []);

  const addFavorite = useCallback(async (car: Car) => {
    if (!currentUserId) {
      // ログインしていない場合はエラー
      throw new Error("Please sign in to add favorites");
    }

    const favorites = favoritesByUser.get(currentUserId) || [];
    if (!favorites.some((f) => f.id === car.id)) {
      const newFavorites = [...favorites, car];
      favoritesByUser.set(currentUserId, newFavorites);
      await saveFavoritesToStorage(currentUserId, newFavorites);
      notifyListeners();
    }
  }, []);

  const removeFavorite = useCallback(async (carId: string) => {
    if (!currentUserId) return;

    const favorites = favoritesByUser.get(currentUserId) || [];
    const newFavorites = favorites.filter((f) => f.id !== carId);
    favoritesByUser.set(currentUserId, newFavorites);
    await saveFavoritesToStorage(currentUserId, newFavorites);
    notifyListeners();
  }, []);

  const clearFavorites = useCallback(async () => {
    if (!currentUserId) return;

    favoritesByUser.set(currentUserId, []);
    await clearFavoritesFromStorage(currentUserId);
    notifyListeners();
  }, []);

  const isFavorite = useCallback((carId: string) => {
    if (!currentUserId) return false;
    const favorites = favoritesByUser.get(currentUserId) || [];
    return favorites.some((f) => f.id === carId);
  }, []);

  // useGoogleAuthとの統合
  useEffect(() => {
    setFavoritesUserCallback(setUser);
    
    // 初期化時に既存のユーザー情報を読み込む
    const loadInitialUser = async () => {
      try {
        let storedUser: string | null = null;
        if (Platform.OS === "web") {
          storedUser = typeof window !== "undefined" ? localStorage.getItem("google_user") : null;
        } else {
          try {
            storedUser = await SecureStore.getItemAsync("google_user");
          } catch (error) {
            console.warn("Failed to load user from SecureStore:", error);
          }
        }
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          await setUser(user.id);
        }
      } catch (error) {
        console.error("Failed to load initial user:", error);
      }
    };
    
    loadInitialUser();
    
    return () => {
      setFavoritesUserCallback(() => Promise.resolve());
    };
  }, [setUser]);

  return {
    favorites: getCurrentFavorites(),
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    setUser, // 認証フックから呼び出すための関数
    isAuthenticated: currentUserId !== null,
  };
}
