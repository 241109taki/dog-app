import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import App from './App';

describe('毎日わんこアプリのコンポーネントテスト', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });

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
    
    // 初回レンダリング時は即座にfetchが走るため、ローディングが表示される
    const loadingText = screen.getByTestId('loading-text');
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveTextContent('くんくん…探索中…');
  });

  it('初期状態でお気に入り一覧のグリッドが存在すること', () => {
    render(<App />);

    expect(screen.getByText('まだお気に入りがありません。上のボタンから追加してください。')).toBeInTheDocument();
  });

  it('図鑑の画像をクリックしたときにモーダル（拡大画面）が開くこと', async () => {
    // LocalStorageにテストデータをセット
    const mockUrl = 'https://images.dog.ceo/breeds/spaniel-brittany/n02101388_1803.jpg';
    localStorage.setItem('dog_favorites', JSON.stringify([mockUrl]));

    render(<App />);

    // 図鑑の中に、設定したモック画像があるか確認
    const thumbImage = screen.getByAltText('お気に入りわんこ');
    expect(thumbImage).toBeInTheDocument();

    // 画像をクリックしてみる（モーダルを開く）
    fireEvent.click(thumbImage);

    // モーダル内の拡大画像が表示されたか検証
    const modalImage = screen.getByAltText('拡大わんこ');
    expect(modalImage).toBeInTheDocument();
    expect(modalImage).toHaveAttribute('src', mockUrl);

    const allCloseButtons = screen.getAllByText('✕');
    const modalCloseButton = allCloseButtons.find(btn => !btn.hasAttribute('title')) || allCloseButtons[0];

    expect(modalCloseButton).toBeInTheDocument();

    // 閉じるボタンをクリックして、モーダルが消えるか検証
    fireEvent.click(modalCloseButton);
    expect(screen.queryByAltText('拡大わんこ')).not.toBeInTheDocument();
  });

  it('「お気に入りに追加」ボタンをクリックすると、図鑑に画像が追加されること', async () => {
    // 初期状態でレンダリング（お気に入りは0件）
    render(<App />);

    // 最初は「まだお気に入りがありません」が表示されている
    expect(screen.getByText('まだお気に入りがありません。上のボタンから追加してください。')).toBeInTheDocument();

    // APIから画像が取得され、画面にメインの「犬」画像が表示されるのを待つ
    const dogImage = await screen.findByTestId('dog-image');
    expect(dogImage).toBeInTheDocument();

    // 「🖤 お気に入りに追加」ボタンを取得してクリック
    const addBtn = screen.getByRole('button', { name: '🖤 お気に入りに追加' });
    fireEvent.click(addBtn);

    // ボタンが「❤️ お気に入り済み」に変化することを確認
    expect(screen.getByRole('button', { name: '❤️ お気に入り済み' })).toBeInTheDocument();

    // 図鑑エリア（favorites-grid）が出現し、画像が1件増えていることを確認
    const favoritesGrid = screen.getByTestId('favorites-grid');
    expect(favoritesGrid).toBeInTheDocument();
    
    const thumbImages = screen.getAllByAltText('お気に入りわんこ');
    expect(thumbImages).toHaveLength(1);
  });

  it('図鑑の「✕」ボタンをクリックすると、図鑑から画像が削除されること', () => {
    // 最初からお気に入りに1件ある状態を作る
    const mockUrl = 'https://images.dog.ceo/breeds/spaniel-brittany/n02101388_1803.jpg';
    localStorage.setItem('dog_favorites', JSON.stringify([mockUrl]));

    render(<App />);

    // 図鑑に画像があることを確認
    expect(screen.getByAltText('お気に入りわんこ')).toBeInTheDocument();

    // 図鑑の画像にある「削除ボタン（✕）」を取得してクリック
    const removeBtn = screen.getByTitle('図鑑から削除');
    fireEvent.click(removeBtn);

    // 削除された結果、グリッドが消えて「まだお気に入りがありません」のテキストに戻るか検証
    expect(screen.queryByTestId('favorites-grid')).not.toBeInTheDocument();
    expect(screen.getByText('まだお気に入りがありません。上のボタンから追加してください。')).toBeInTheDocument();
  });

});