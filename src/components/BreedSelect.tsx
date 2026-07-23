import React from 'react';
import { breedTranslations } from '../constants/breedTranslations';

interface BreedSelectProps {
  breeds: string[];
  selectedBreed: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const BreedSelect: React.FC<BreedSelectProps> = ({ breeds, selectedBreed, onChange }) => {
  return (
    <div className="w-full max-w-xs mb-6">
      <label htmlFor="breed-select" className="block text-sm font-semibold text-slate-600 mb-2 text-left">
        犬種を選ぶ:
      </label>
      <select
        id="breed-select"
        value={selectedBreed}
        onChange={onChange}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
      >
        <option value="">ランダム</option>
        {breeds.map((breed) => (
          <option key={breed} value={breed}>
            {breedTranslations[breed] || breed.charAt(0).toUpperCase() + breed.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};