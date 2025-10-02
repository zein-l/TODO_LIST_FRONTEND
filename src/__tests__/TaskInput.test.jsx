// Integration-style test: uses the TaskInput inside App to add a new task.
// We import Jest globals so ESLint doesn't complain.

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest, beforeEach, test, expect } from '@jest/globals';

// Mock the CSS file imported by App.jsx so Jest doesn't choke on it.
jest.unstable_mockModule('../App.css', () => ({}));

beforeEach(() => {
  localStorage.clear();
});

test('adds a new task via TaskInput', async () => {
  const user = userEvent.setup();
  const { default: App } = await import('../App.jsx');

  render(<App />);

  // Labels come from TaskInput.jsx: "Task Title *" and "Description (optional)"
  const titleInput = screen.getByLabelText(/task title/i);
  const descInput = screen.getByLabelText(/description/i);

  await user.type(titleInput, 'Buy milk');
  await user.type(descInput, '2 liters');
  await user.click(screen.getByRole('button', { name: /add task/i }));

  expect(screen.getByText('Buy milk')).toBeInTheDocument();
  expect(screen.getByText('2 liters')).toBeInTheDocument();
});
