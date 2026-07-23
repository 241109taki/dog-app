import React from 'react';

interface FavoriteListProps {
  favorites: string[];
  onRemoveFavorite: (url: string) => void;
  onSelectImage: (url: string) => void;
}

export const FavoriteList: React.FC<FavoriteListProps> = ({
  favorites,
  onRemoveFavorite,
  onSelectImage,
}) => {
  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
      <h2 className="text-xl font-extrabold text-slate-700 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
        📚 マイわんこ図鑑{' '}
        <span className="px-2.5 py-0.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
          {favorites.length} 匹
        </span>
      </h2>
      {favorites.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-8">
          まだお気に入りがありません。上のボタンから追加してください。
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" data-testid="favorites-grid">
          {favorites.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden shadow-sm group border border-slate-100 cursor-pointer"
            >
              <img
                src={url}
                alt="お気に入りわんこ"
                onClick={() => onSelectImage(url)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation(); // モーダル開閉イベントの不必要なバブリングを防ぐ
                  onRemoveFavorite(url);
                }}
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
  );
};