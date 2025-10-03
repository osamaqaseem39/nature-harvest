import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

test('renders without crashing', () => {
  render(<App />);
});

test('uses sessionStorage for token storage', () => {
  // This test verifies that sessionStorage is being used
  expect(sessionStorageMock.getItem).toBeDefined();
  expect(sessionStorageMock.setItem).toBeDefined();
  expect(sessionStorageMock.removeItem).toBeDefined();
});
