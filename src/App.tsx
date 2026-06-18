import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [dogUrl, setDogUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // お気に入り登録した画像のURLリストを管理する
  const [favorites, setFavorites] = useState<string[]>(() => {
    // 初期化時にLocalStorageからデータを読み込む
    const saved = localStorage.getItem('dog_favorites');
    return saved ? JSON.parse(saved) : [];
  });

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

  // お気に入り追加
  const addFavorite = () => {
    if (dogUrl && !favorites.includes(dogUrl)) {
      const newFavorites = [...favorites, dogUrl];
      setFavorites(newFavorites);
      localStorage.setItem('dog_favorites', JSON.stringify(newFavorites));
    }
  };

  // お気に入り解除
  const removeFavorite = (url:string) => {
    const newFavorites = favorites.filter((fav) => fav !== url);
    setFavorites(newFavorites);
    localStorage.setItem('dog_favorites', JSON.stringify(newFavorites));
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>🐶🐶🐶</h1>

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
      <div style={{ minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <p data-testid="loading-text">くんくん…探索中…</p>
        ) : (
          dogUrl && (
            <div>
              <img
                src={dogUrl}
                alt="犬"
                data-testid="dog-image"
                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }}
              />
              <div style={{ marginTop: '10px' }}>
              {/* お気に入りボタン */}
              <button
                onClick={addFavorite}
                disabled={favorites.includes(dogUrl)}
                style={{ backgroundColor: favorites.includes(dogUrl) ? '#ccc' : '#ff6b6b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}
                >
                {favorites.includes(dogUrl) ? '❤️ お気に入り済み' : '🖤 お気に入りに追加'}
              </button>
              </div>
            </div>
          )
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => fetchDogImage()} disabled={loading}>
          {selectedBreed ? '同じ犬種をもう一度見る' : '他の犬を見る'}
        </button>
      </div>

      <hr style={{ margin: '40px 0', borderColor: '#eee' }} />

      {/* お気に入り一覧エリア */}
      <h2>マイわんこ図鑑 ({favorites.length}匹)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', padding: '20px' }} data-testid="favorites-grid">
        {favorites.map((url, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img src={url} alt="お気に入りわんこ" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
            <button
              onClick={() => removeFavorite(url)}
              style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px', lineHeight: '24px', padding: 0 }}
              title="削除"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;