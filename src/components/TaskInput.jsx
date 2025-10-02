import { useState } from 'react';

/**
 * TaskInput
 * - Adds a new task with required title, optional description & due date.
 * - Emits { title, description, dueDate }.
 */
export default function TaskInput({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const t = title.trim();
    const d = description.trim();
    const due = dueDate ? dueDate : null;
    if (!t) return;

    onAdd({ title: t, description: d || '', dueDate: due });
    setTitle('');
    setDescription('');
    setDueDate('');
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="task-title" className="label">
          Task Title <span style={{ color: '#d00' }}>*</span>
        </label>
        <input
          id="task-title"
          className="input"
          type="text"
          placeholder="e.g : Text Mohammad Good Morning"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>

      <div className="form-row">
        <label htmlFor="task-desc" className="label">Description (optional)</label>
        <textarea
          id="task-desc"
          className="textarea"
          placeholder="e.g : Add Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="actions">
        <div className="form-row" style={{ flex: '1 1 220px' }}>
          <label htmlFor="task-due" className="label">Due date (optional)</label>
          <input
            id="task-due"
            className="date input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btn" style={{ alignSelf: 'center' }}>
          Add Task
        </button>
      </div>
    </form>
  );
}
