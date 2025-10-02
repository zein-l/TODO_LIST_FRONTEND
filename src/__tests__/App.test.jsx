// Minimal Jest + RTL test for the App header.
// We import Jest globals so ESLint doesn't complain.

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { jest, beforeEach, test, expect } from '@jest/globals';

// Mock the CSS file imported by App.jsx so Jest doesn't choke on it.
jest.unstable_mockModule('../App.css', () => ({}));

beforeEach(() => {
  // Ensure a clean state for localStorage-backed tasks.
  localStorage.clear();
});

test('renders the To-Do List header', async () => {
  const { default: App } = await import('../App.jsx');
  render(<App />);
  expect(screen.getByRole('heading', { name: /to-do list/i })).toBeInTheDocument();
});
