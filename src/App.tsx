import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [dogUrl, setDogUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 起動時に犬種の一覧を取得
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

  // 選択された犬種（またはランダム）の画像を取得
  const fetchDogImage = async (breed?: string) => {
    setLoading(true);
    const targetBreed = breed || selectedBreed;
    // 犬種が選択されていればその犬種、空ならランダム
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
  };

  // 初回表示時
  useEffect(() => {
    fetchDogImage();
  }, []);

  // セレクトボックス変更時
  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const breed = e.target.value;
    setSelectedBreed(breed);
    fetchDogImage(breed); // 選択した瞬間にも自動フェッチ
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>毎日わんこ 🐶</h1>

      {/* 犬種選択セレクトボックス */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="breed-select" style={{ marginRight: '10px' }}>犬種を選ぶ: </label>
        <select id="breed-select" value={selectedBreed} onChange={handleBreedChange}>
          <option value="">ランダム</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      {/* 画像表示エリア */}
      {loading ? (
        <p data-testid="loading-text">くんくん…探索中…</p>
      ) : (
        dogUrl && (
          <img
            src={dogUrl}
            alt="可愛い犬"
            data-testid="dog-image"
            style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }}
          />
        )
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => fetchDogImage()} disabled={loading}>
          {selectedBreed ? '同じ犬種をもう一度見る' : '他の犬を見る'}
        </button>
      </div>
    </div>
  );
}

export default App;