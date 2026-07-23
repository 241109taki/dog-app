import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { useFavorites } from './hooks/userFavorites';
import { Header } from './components/Header'
import { BreedSelect } from './components/BreedSelect';
import { DogViewer } from './components/DogViewer';
import { Layout } from './components/Layout';
import { MainContainer } from './components/MainContainer';
import { FavoriteList } from './components/FavoriteList';
import { ImageModal } from './components/ImageModal';

function App() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [dogUrl, setDogUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedModalUrl, setSelectedModalUrl] = useState<string | null>(null);

  // カスタムフックを利用
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // 初回に犬種一覧を取得
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();
        if (data.status === 'success') {
          setBreeds(Object.keys(data.message));
        }
      } catch (error) {
        console.error('犬種の取得に失敗しました', error);
      }
    };
    fetchBreeds();
  }, []);

  // 画像の取得
  const fetchDogImage = useCallback(async (breed?: string) => {
    setLoading(true);
    const targetBreed = breed !== undefined ? breed : selectedBreed;
    const url = targetBreed
      ? `https://dog.ceo/api/breed/${targetBreed}/images/random`
      : 'https://dog.ceo/api/breeds/image/random';

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'success') {
        setDogUrl(data.message);
      }
    } catch (error) {
      console.error('画像の取得に失敗しました', error);
    } finally {
      setLoading(false);
    }
  }, [selectedBreed]);

  // 初期表示時にランダム画像を1枚ロード
  useEffect(() => {
    fetchDogImage('');
  }, []);

  // セレクトボックスの切り替えハンドラ
  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const breed = e.target.value;
    setSelectedBreed(breed);
    fetchDogImage(breed);
  };

  return (
    <Layout>
      <Header />
      <MainContainer
        breeds={breeds}
        selectedBreed={selectedBreed}
        dogUrl={dogUrl}
        loading={loading}
        isFavorite={favorites.includes(dogUrl)}
        onBreedChange={handleBreedChange}
        onAddFavorite={() => addFavorite(dogUrl)}
        onFetchImage={() => fetchDogImage()}
      />
      <FavoriteList
        favorites={favorites}
        onRemoveFavorite={removeFavorite}
        onSelectImage={setSelectedModalUrl}
      />
      <ImageModal
        imageUrl={selectedModalUrl}
        onClose={() => setSelectedModalUrl(null)}
      />
    </Layout>
  );
}

export default App;