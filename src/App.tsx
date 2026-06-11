import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [dogUrl, setDogUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDogImage = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();
      if (data.status === 'success') {
        setDogUrl(data.message);
      }
    } catch (error) {
      console.error("犬の画像の取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogImage();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>毎日わんこ 🐶</h1>
      {loading ? (
        <p>くんくん…探索中…</p>
      ) : (
        dogUrl && <img src={dogUrl} alt="可愛い犬" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }} />
      )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={fetchDogImage} disabled={loading}>
          他の犬を見る
        </button>
      </div>
    </div>
  );
}

export default App;