import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import App from './App';

describe('毎日わんこアプリのコンポーネントテスト', () => {
  
  it('初期画面の基本要素がすべてレンダリングされていること', () => {
    render(<App />);
    
    // タイトルの確認
    expect(screen.getByText('🐶🐶🐶')).toBeInTheDocument();
    expect(screen.getByText(/マイわんこ図鑑/)).toBeInTheDocument();
    
    // ラベルとセレクトボックスの確認
    expect(screen.getByLabelText('犬種を選ぶ:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    // ボタンの確認
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('データフェッチ中にローディングテキストが表示されること', () => {
    render(<App />);
    
    // 初回レンダリング時は即座にfetchが走るため、ローディングが表示されるはず
    const loadingText = screen.getByTestId('loading-text');
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveTextContent('くんくん…探索中…');
  });

  it('初期状態でお気に入り一覧のグリッドが存在すること', () => {
    render(<App />);
    
    const favoritesGrid = screen.getByTestId('favorites-grid');
    expect(favoritesGrid).toBeInTheDocument();
  });
});