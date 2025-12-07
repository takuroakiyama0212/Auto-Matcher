import { useState, useCallback, useMemo } from "react";
import { Car } from "@/data/cars";

let globalFavorites: Car[] = [];
let listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
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

  const addFavorite = useCallback((car: Car) => {
    if (!globalFavorites.some((f) => f.id === car.id)) {
      globalFavorites = [...globalFavorites, car];
      notifyListeners();
    }
  }, []);

  const removeFavorite = useCallback((carId: string) => {
    globalFavorites = globalFavorites.filter((f) => f.id !== carId);
    notifyListeners();
  }, []);

  const clearFavorites = useCallback(() => {
    globalFavorites = [];
    notifyListeners();
  }, []);

  const isFavorite = useCallback((carId: string) => {
    return globalFavorites.some((f) => f.id === carId);
  }, []);

  return {
    favorites: globalFavorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
  };
}
