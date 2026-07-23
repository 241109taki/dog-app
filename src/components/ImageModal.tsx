import React from 'react';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="relative max-w-3xl max-h-[85vh] bg-white p-2 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-800 rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md transition-colors text-lg z-10"
        >
          ✕
        </button>
        <img
          src={imageUrl}
          alt="拡大わんこ"
          className="max-w-full max-h-[80vh] object-contain rounded-xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};