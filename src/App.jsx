import { useEffect, useMemo, useRef, useState } from 'react';
import TaskInput from './components/TaskInput.jsx';
import TaskItem from './components/TaskItem.jsx';
import './App.css';

const FILTERS = { ALL: 'all', ACTIVE: 'active', COMPLETED: 'completed' };
const STORAGE_KEY = 'todo-app:tasks';
const THEME_KEY = 'todo-app:theme';
const BANNER_DURATION = 4200;

function loadTasks() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (t) =>
          t &&
          typeof t.id === 'string' &&
          typeof t.title === 'string' &&
          typeof t.completed === 'boolean'
      )
      .map((t) => ({
        id: t.id,
        title: t.title,
        description: typeof t.description === 'string' ? t.description : '',
        completed: !!t.completed,
        dueDate: t.dueDate ?? null,
      }));
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  } catch {
    // Intentionally left empty to ignore errors
  }
}

function sortByDue(a, b) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const ad = a.dueDate ? new Date(a.dueDate) : null;
  const bd = b.dueDate ? new Date(b.dueDate) : null;

  const overA = ad && ad < startOfToday;
  const overB = bd && bd < startOfToday;

  if (overA !== overB) return overA ? -1 : 1;
  if (ad && bd) return ad - bd;
  if (ad || bd) return ad ? -1 : 1;
  return 0;
}

export default function App() {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [filter, setFilter] = useState(FILTERS.ALL);

  // Dark mode (persisted + system default)
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  });

  // Save tasks on change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Persist theme preference
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    } catch {
      // Intentionally left empty to ignore errors
    }
  }, [dark]);

  // Exit-animation tracking
  const [exitingId, setExitingId] = useState(null);

  // Undo toast + backup of last deleted
  const [toast, setToast] = useState(null); // { id, title }
  const lastDeletedRef = useRef(null);
  const hideToastTimer = useRef(null);
  const deleteTimerRef = useRef(null); // remove-from-state timer

  // Playful banner (far-future due date gag)
  const [banner, setBanner] = useState(null);
  const bannerTimer = useRef(null);

  function showUndoToast(task) {
    clearTimeout(hideToastTimer.current);
    setToast({ id: task.id, title: task.title });
    hideToastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  function showBanner(text) {
    clearTimeout(bannerTimer.current);
    setBanner(text);
    bannerTimer.current = setTimeout(() => setBanner(null), BANNER_DURATION);
  }

  function handleAddTask({ title, description, dueDate }) {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const newTask = {
      id,
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
      dueDate: dueDate || null,
    };

    // Fun banner if the due date is way in the future
    if (dueDate) {
      const due = new Date(dueDate);
      const now = new Date();
      const daysAhead = Math.round((due - now) / (1000 * 60 * 60 * 24));
      if (due.getFullYear() > 2025 || daysAhead > 365) {
        showBanner('This is a to-do list, not NASA’s mission schedule 😄 — maybe pick a nearer date?');
      }
    }

    setTasks((prev) => [newTask, ...prev]);
  }

  function handleToggleTask(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  // Robust delete with cancellable timer (so Undo works before/after removal)
  function handleDeleteWithBackup(id) {
    const toDelete = tasks.find((t) => t.id === id);
    if (!toDelete) return;

    // store backup + show toast immediately
    lastDeletedRef.current = toDelete;
    showUndoToast(toDelete);

    // start exit animation
    setExitingId(id);

    // cancel any in-flight removal then schedule a new one
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    deleteTimerRef.current = setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setExitingId(null);
      deleteTimerRef.current = null;
    }, 260); // match CSS exit timing
  }

  function undoLastDelete() {
    // Cancel pending removal if animation hasn't completed
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }

    const backup = lastDeletedRef.current;
    if (backup) {
      setTasks((prev) => {
        const exists = prev.some((t) => t.id === backup.id);
        return exists ? prev : [backup, ...prev];
      });
      lastDeletedRef.current = null;
      setExitingId(null);
    }

    setToast(null);
    clearTimeout(hideToastTimer.current);
  }

  function getFilteredTasks() {
    switch (filter) {
      case FILTERS.ACTIVE:
        return tasks.filter((t) => !t.completed);
      case FILTERS.COMPLETED:
        return tasks.filter((t) => t.completed);
      case FILTERS.ALL:
      default:
        return tasks;
    }
  }

  const filteredSortedTasks = useMemo(
    () => getFilteredTasks().slice().sort(sortByDue),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks, filter]
  );

  function FilterButton({ label, value }) {
    const isActive = filter === value;
    return (
      <button className="btn" onClick={() => setFilter(value)} aria-pressed={isActive}>
        {label}
      </button>
    );
  }

  const lightTagline = 'Capture tasks. Set dates. Ship life faster.';
  const darkTagline = 'Build in the dark. Ship in the light.';

  return (
    <div
      className={`app ${dark ? 'dark' : ''}`}
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
          e.preventDefault();
          setDark((d) => !d);
        }
      }}
    >
      <div className="container">
        <header className="app-header">
          <div className="header-row">
            <h1 className="app-title">To-Do List</h1>
            <button
              type="button"
              className="btn"
              onClick={() => setDark((d) => !d)}
              aria-pressed={dark}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {dark ? '☀️ Light mode' : '🌙 Dark mode'}
            </button>
          </div>
          <p className="app-subtitle">{dark ? darkTagline : lightTagline}</p>
          {banner ? <div className="banner">{banner}</div> : null}
        </header>

        <section className="card">
          <TaskInput onAdd={handleAddTask} />
        </section>

        {/* Filters + live announce for SR */}
        <section className="filters" aria-label="Task filters">
          <FilterButton label="All" value={FILTERS.ALL} />
          <FilterButton label="Active" value={FILTERS.ACTIVE} />
          <FilterButton label="Completed" value={FILTERS.COMPLETED} />
          <span className="filters__count">
            {filteredSortedTasks.length}/{tasks.length} shown
          </span>
          <p aria-live="polite" style={{ position: 'absolute', left: '-9999px' }}>
            {filteredSortedTasks.length} of {tasks.length} tasks shown
          </p>
        </section>

        {/* Task list (filtered + sorted) */}
        <section>
          {filteredSortedTasks.length === 0 ? (
            <p className="empty">
              {tasks.length === 0 ? 'No tasks yet. Add your first task!' : 'No tasks match this filter.'}
            </p>
          ) : (
            <ul className="task-list">
              {filteredSortedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  exiting={exitingId === task.id}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteWithBackup}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Undo toast */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <span className="toast__msg">Deleted “{toast.title}”.</span>
          <button type="button" className="btn toast__btn" onClick={undoLastDelete}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
