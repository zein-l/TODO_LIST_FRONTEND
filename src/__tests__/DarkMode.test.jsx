import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest, beforeEach, test, expect } from '@jest/globals';

// Mock the CSS file imported by App.jsx
jest.unstable_mockModule('../App.css', () => ({}));

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = ''; // reset DOM
});

test('dark mode toggle adds and removes the "dark" class on root', async () => {
  const user = userEvent.setup();
  const { default: App } = await import('../App.jsx');

  const { container } = render(<App />);
  const root = container.querySelector('.app');
  expect(root).toBeInTheDocument();
  expect(root).not.toHaveClass('dark');

  // Turn on dark mode
  const toggleBtn = screen.getByRole('button', { name: /dark mode/i });
  await user.click(toggleBtn);
  expect(root).toHaveClass('dark');
  expect(toggleBtn).toHaveTextContent(/light mode/i);

  // Turn it back off
  await user.click(toggleBtn);
  expect(root).not.toHaveClass('dark');
  expect(toggleBtn).toHaveTextContent(/dark mode/i);
});
