import '@testing-library/jest-dom';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest, beforeEach, test, expect } from '@jest/globals';

// Mock the CSS file imported by App.jsx
jest.unstable_mockModule('../App.css', () => ({}));

beforeEach(() => {
  localStorage.clear();
});

test('can toggle a task as completed', async () => {
  const user = userEvent.setup();
  const { default: App } = await import('../App.jsx');

  render(<App />);
  // Add a new task
  await user.type(screen.getByLabelText(/task title/i), 'Walk dog');
  await user.click(screen.getByRole('button', { name: /add task/i }));

  const checkbox = screen.getByRole('checkbox', { name: /walk dog/i });
  expect(checkbox).not.toBeChecked();

  await user.click(checkbox);
  expect(checkbox).toBeChecked();
  expect(screen.getByText(/status: completed/i)).toBeInTheDocument();
});

test('can delete a task', async () => {
  const user = userEvent.setup();
  const { default: App } = await import('../App.jsx');

  render(<App />);
  await user.type(screen.getByLabelText(/task title/i), 'Buy bread');
  await user.click(screen.getByRole('button', { name: /add task/i }));

  expect(screen.getByText('Buy bread')).toBeInTheDocument();

  // Delete it (removal is animated; wait for it to be removed)
  await user.click(screen.getByRole('button', { name: /delete task "buy bread"/i }));
  await waitForElementToBeRemoved(() => screen.queryByText('Buy bread'));
});

test('filters show Active and Completed correctly', async () => {
  const user = userEvent.setup();
  const { default: App } = await import('../App.jsx');

  render(<App />);
  // Add two tasks
  await user.type(screen.getByLabelText(/task title/i), 'One');
  await user.click(screen.getByRole('button', { name: /add task/i }));

  await user.type(screen.getByLabelText(/task title/i), 'Two');
  await user.click(screen.getByRole('button', { name: /add task/i }));

  // Mark one as completed
  const checkbox = screen.getByRole('checkbox', { name: /two/i });
  await user.click(checkbox);

  // Filter Active → should show only "One"
  await user.click(screen.getByRole('button', { name: /^active$/i }));
  expect(screen.getByText('One')).toBeInTheDocument();
  expect(screen.queryByText('Two')).not.toBeInTheDocument();

  // Filter Completed → should show only "Two"
  await user.click(screen.getByRole('button', { name: /^completed$/i }));
  expect(screen.getByText('Two')).toBeInTheDocument();
  expect(screen.queryByText('One')).not.toBeInTheDocument();

  // Back to All
  await user.click(screen.getByRole('button', { name: /^all$/i }));
  expect(screen.getByText('One')).toBeInTheDocument();
  expect(screen.getByText('Two')).toBeInTheDocument();
});
