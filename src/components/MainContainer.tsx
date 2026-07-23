import React from 'react';
import { BreedSelect } from './BreedSelect';
import { DogViewer } from './DogViewer';

interface MainContainerProps {
  breeds: string[];
  selectedBreed: string;
  dogUrl: string;
  loading: boolean;
  isFavorite: boolean;
  onBreedChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddFavorite: () => void;
  onFetchImage: () => void;
}

export const MainContainer: React.FC<MainContainerProps> = ({
  breeds,
  selectedBreed,
  dogUrl,
  loading,
  isFavorite,
  onBreedChange,
  onAddFavorite,
  onFetchImage,
}) => {
  return (
    <main className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-orange-100/50 flex flex-col items-center">
      <BreedSelect
        breeds={breeds}
        selectedBreed={selectedBreed}
        onChange={onBreedChange}
      />
      <DogViewer
        dogUrl={dogUrl}
        loading={loading}
        isFavorite={isFavorite}
        selectedBreed={selectedBreed}
        onAddFavorite={onAddFavorite}
        onFetchImage={onFetchImage}
      />
    </main>
  );
};