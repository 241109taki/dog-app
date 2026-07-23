import React from 'react';

interface DogViewerProps {
  dogUrl: string;
  loading: boolean;
  isFavorite: boolean;
  selectedBreed: string;
  onAddFavorite: () => void;
  onFetchImage: () => void;
}

export const DogViewer: React.FC<DogViewerProps> = ({
  dogUrl,
  loading,
  isFavorite,
  selectedBreed,
  onAddFavorite,
  onFetchImage,
}) => {
  return (
    <>
      <div className="w-full max-w-md h-96 bg-slate-50 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center relative border border-slate-100">
        {loading ? (
          <div className="text-center" data-testid="loading-text">
            <div className="animate-bounce text-4xl mb-2">🐾</div>
            <p className="text-sm font-bold text-orange-500 tracking-wider animate-pulse">
              くんくん…探索中…
            </p>
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
                <button
                  onClick={onAddFavorite}
                  disabled={isFavorite}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all duration-200 transform active:scale-95 flex items-center gap-2 ${
                    isFavorite
                      ? 'bg-slate-800/80 text-amber-400 cursor-not-allowed backdrop-blur-sm'
                      : 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {isFavorite ? '❤️ お気に入り済み' : '🖤 お気に入りに追加'}
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <button
        onClick={onFetchImage}
        disabled={loading}
        className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 transform active:scale-[0.98]"
      >
        {selectedBreed ? '同じ犬種をもう一度見る' : '他の犬を見る'}
      </button>
    </>
  );
};