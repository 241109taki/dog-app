import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('タイトルが正しく表示されていること', () => {
    render(<App />);
    expect(screen.getByText('毎日わんこ 🐶')).toBeInTheDocument();
  });
});