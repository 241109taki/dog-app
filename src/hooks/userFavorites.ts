import { useState } from 'react';

const STORAGE_KEY = 'dog_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const addFavorite = (url: string) => {
    if (url && !favorites.includes(url)) {
      const newFavorites = [...favorites, url];
      setFavorites(newFavorites);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    }
  };

  const removeFavorite = (url: string) => {
    const newFavorites = favorites.filter((fav) => fav !== url);
    setFavorites(newFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
  };

  return { favorites, addFavorite, removeFavorite };
};