import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest, beforeEach, test, expect } from '@jest/globals';

// Mock the CSS file imported by App.jsx
jest.unstable_mockModule('../App.css', () => ({}));

beforeEach(() => {
  // Ensure clean storage before each test
  localStorage.clear();
  document.body.innerHTML = '';
});

test('tasks persist to and load from localStorage', async () => {
  const user = userEvent.setup();
  const { default: App } = await import('../App.jsx');

  // First render: add a task (this writes to localStorage via useEffect)
  const first = render(<App />);
  await user.type(screen.getByLabelText(/task title/i), 'Persist me');
  await user.click(screen.getByRole('button', { name: /add task/i }));
  expect(screen.getByText('Persist me')).toBeInTheDocument();

  // Unmount to simulate closing the app/tab
  first.unmount();

  // Second render: fresh mount should read from localStorage
  const second = render(<App />);
  expect(screen.getByText('Persist me')).toBeInTheDocument();

  // (Optional) confirm storage shape
  const raw = localStorage.getItem('todo-app:tasks');
  expect(raw).toBeTruthy();
  const parsed = JSON.parse(raw);
  expect(Array.isArray(parsed)).toBe(true);
  expect(parsed.some((t) => t.title === 'Persist me')).toBe(true);

  second.unmount();
});
