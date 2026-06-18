import { useState, useEffect } from 'react';
import './App.css';

// 犬種名を日本語に変換する辞書
const breedTranslations: { [key: string]: string } = {
  akita: '秋田犬',
  shiba: '柴犬',
  chihuahua: 'チワワ',
  poodle: 'プードル',
  pug: 'パグ',
  beagle: 'ビーグル',
  boxer: 'ボクサー',
  bulldog: 'ブルドッグ',
  chow: 'チャウチャウ',
  corgi: 'コーギー',
  dachshund: 'ダックスフンド',
  dalmatian: 'ダルメシアン',
  doberman: 'ドーベルマン',
  husky: 'シベリアンハスキー',
  labrador: 'ラブラドールレトリバー',
  maltese: 'マルチーズ',
  papillon: 'パピヨン',
  pomeranian: 'ポメラニアン',
  retriever: 'ゴールデンレトリバー',
  rottweiler: 'ロットワイラー',
  samoyed: 'サモエド',
  schnauzer: 'シュナウザー',
  shihtzu: 'シーズー',
  terrier: 'テリア',
  affenpinscher: 'アーフェンピンシャー',
  african: 'リカオン',
  airedale: 'エアデール',
  appenzeller: 'アッペンツェラー・キャトル・ドッグ',
  australian: 'オーストラリアン',
  bakharwal: 'カシミール・シープドッグ',
  basenji: 'バセンジー',
  bluetick: 'ブルーティック・クーンハウンド',
  borzoi: 'ボルゾイ',
  bouvier: 'ブービエ・デ・フランドル',
  brabancon: 'プチ・ブラバンソン',
  briard: 'ブリアード',
  buhund: 'ノルウェー・ブーフント',
  bullterrier: 'ブルテリア',
  cattledog: 'オーストラリアン・キャトル・ドッグ',
  cavapoo: 'キャバプー',
  chippiparai: 'チッピパライ',
  clumber: 'クランバー・スパニエル',
  cockapoo: 'コッカプー',
  collie: 'コリー',
  coonhound: 'クーンハウンド',
  cotondetulear: 'コトン・ド・チュレアール',
  dane: 'グレート・デーン',
  danish: 'ダニッシュ・スウェディッシュ・ファームドッグ',
  deerhound: 'スコティッシュ・ディアハウンド',
  dhole: 'ドール(アカオオカミ)',
  dingo: 'ディンゴ',
  elkhound: 'ノルウェリアン・エルクハウンド',
  entlebucher: 'エントレブッハー・マウンテン・ドッグ',
  eskimo: 'アメリカン・エスキモー・ドッグ',
  finnish: 'フィニッシュ・スピッツ',
  frise: 'ビション・フリーゼ',
  gaddi: 'ガディ・ハウンド',
  german: 'ジャーマン・シェパード',
  greyhound: 'グレイハウンド',
  groenendael: 'ベルジアン・シェパード・グローネンダール',
  havanese: 'ハバニーズ',
  hound: 'ハウンド',
  keeshond: 'キースホンド',
  kelpie: 'オーストラリアン・ケルピー',
  kombai: 'コンバイ',
  komondor: 'コモンドール',
  kuvasz: 'クバズ',
  labradoodle: 'ラブラドゥードル',
  leonberg: 'レオンベルガー',
  lhasa: 'ラサアプソ',
  malamute: 'アラスカン・マラミュート',
  malinois: 'ベルジアン・シェパード・マリノア',
  mastiff: 'マスティフ',
  mexicanhairless: 'メキシカン・ヘアレス・ドッグ',
  mix: 'ミックス(雑種)',
  mountain: 'マウンテン・ドッグ',
  mudhol: 'マドホル・ハウンド',
  newfoundland: 'ニューファンドランド',
  otterhound: 'オターハウンド',
  ovcharka: 'オヴチャルカ',
  pariah: 'パリア犬',
  pekinese: 'ペキニーズ',
  pembroke: 'ウェルシュ・コーギー・ペンブローク',
  pinscher: 'ピンシャー',
  pitbull: 'ピットブル',
  pointer: 'ポインター',
  puggle: 'パグル',
  pyrenees: 'グレート・ピレニーズ',
  rajapalayam: 'ラジャパラヤム',
  redbone: 'レッドボーン・クーンハウンド',
  ridgeback: 'ローデシアン・リッジバック',
  rough: 'ラフ・コリー',
  saluki: 'サルーキ',
  schipperke: 'シッパーキ',
  segugio: 'セグージオ',
  setter: 'セッター',
  sharpei: 'シャーペイ',
  sheepdog: 'シープドッグ',
  spaniel: 'スパニエル',
  spitz: 'スピッツ',
  springer: 'スプリンガー・スパニエル',
  stbernard: 'セント・バーナード',
  tervuren: 'ベルジアン・シェパード・タービュレン',
  vizsla: 'ビズラ',
  waterdog: 'ウォーター・ドッグ',
  weimaraner: 'ワイマラナー',
  whippet: 'ウィペット',
  wolfhound: 'アイリッシュ・ウルフハウンド',
};

function App() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [dogUrl, setDogUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedModalUrl, setSelectedModalUrl] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 text-slate-800 font-sans antialiased">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 drop-shadow-sm">🐶🐶🐶</h1>
        </header>
        <main className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-orange-100/50 flex flex-col items-center">
          {/* 犬種選択セレクトボックス */}
          <div className='w-full max-w-xs mb-6'>
            <label htmlFor="breed-select" className="block text-sm font-semibold text-slate-600 mb-2 text-left">犬種を選ぶ: </label>
            <select 
              id="breed-select" 
              value={selectedBreed} 
              onChange={handleBreedChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
              <option value="">ランダム</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {/* 翻訳があれば日本語、なければ英語の頭文字を大文字にして表示 */}
                  {breedTranslations[breed] || breed.charAt(0).toUpperCase() + breed.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* 画像表示エリア */}
          <div className="w-full max-w-md h-96 bg-slate-50 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center relative border border-slate-100">
            {loading ? (
              <div className="text-center" data-testid="loading-text">
                  <div className="animate-bounce text-4xl mb-2">🐾</div>
                  <p className="text-sm font-bold text-orange-500 tracking-wider animate-pulse">くんくん…探索中…</p>
                </div>
            ) : (
              dogUrl && (
                <div className="w-full h-full group relative">
                  <img
                    src={dogUrl}
                    alt="犬"
                    data-testid="dog-image"
                    className="w-full h-full object-cover object-center transition-transform duration-300"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  {/* お気に入りボタン */}
                  <button
                    onClick={addFavorite}
                    disabled={favorites.includes(dogUrl)}
                    className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all duration-200 transform active:scale-95 flex items-center gap-2 ${
                          favorites.includes(dogUrl)
                            ? 'bg-slate-800/80 text-amber-400 cursor-not-allowed backdrop-blur-sm'
                            : 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                    >
                    {favorites.includes(dogUrl) ? '❤️ お気に入り済み' : '🖤 お気に入りに追加'}
                  </button>
                  </div>
                </div>
              )
            )}
          </div>

            <button onClick={() => fetchDogImage()} disabled={loading}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 transform active:scale-[0.98]"
            >
              {selectedBreed ? '同じ犬種をもう一度見る' : '他の犬を見る'}
            </button>
        </main>

        {/* お気に入り一覧エリア */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
          <h2 className="text-xl font-extrabold text-slate-700 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
            📚 マイわんこ図鑑 <span className="px-2.5 py-0.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">{favorites.length} 匹</span>
          </h2>
          {favorites.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8">まだお気に入りがありません。上のボタンから追加してください。</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" data-testid="favorites-grid">
                {favorites.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group border border-slate-100">
                    <img src={url} alt="お気に入りわんこ" onClick={() => setSelectedModalUrl(url)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    
                    {/* 削除ボタン */}
                    <button
                      onClick={() => removeFavorite(url)}
                      className="absolute top-2 right-2 bg-slate-900/60 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md backdrop-blur-sm text-xs font-bold"
                      title="図鑑から削除"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
          )}
        </section>
      </div>
      {selectedModalUrl && (
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={() => setSelectedModalUrl(null)} // 背景クリックで閉じる
      >
        <div className="relative max-w-3xl max-h-[85vh] bg-white p-2 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
          {/* 閉じるボタン */}
          <button
            onClick={() => setSelectedModalUrl(null)}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-800 rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md transition-colors text-lg z-10"
          >
            ✕
          </button>
          
          {/* 拡大画像 */}
          <img
            src={selectedModalUrl}
            alt="拡大わんこ"
            className="max-w-full max-h-[80vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    )}
    </div>
  );
}

export default App;