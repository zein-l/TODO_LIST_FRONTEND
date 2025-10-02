/**
 * TaskItem
 * - Renders a single task with checkbox, due badge(s), and delete.
 * - Props:
 *    - task: { id, title, description, completed, dueDate?: string|null }
 *    - onToggle: (id: string) => void
 *    - onDelete: (id: string) => void
 *    - exiting?: boolean  (for exit animation)
 */
export default function TaskItem({ task, onToggle, onDelete, exiting = false }) {
  const { id, title, description, completed, dueDate } = task;

  const now = new Date();
  const due = dueDate ? new Date(dueDate) : null;
  const isOverdue =
    due && due < new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isToday =
    due &&
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate();

  return (
    <li className={`task ${completed ? 'task--completed' : ''} ${exiting ? 'is-exiting' : ''}`} data-id={id}>
      <input
        id={`task-${id}`}
        className="task__check"
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        aria-label={`Mark "${title}" as ${completed ? 'active' : 'completed'}`}
      />

      <div>
        <label htmlFor={`task-${id}`} style={{ display: 'block', cursor: 'pointer' }}>
          <h3 className="task__title">{title}</h3>
        </label>

        {description ? <div className="task__desc">{description}</div> : null}

        <div className="task__meta">
          <span style={{ color: 'var(--muted-2)' }}>
            Status: {completed ? 'Completed' : 'Active'}
          </span>

          {due && (
            <span className={`badge ${isOverdue ? 'badge--overdue' : 'badge--due'}`}>
              {isOverdue ? 'Overdue' : isToday ? 'Due today' : `Due ${dueDate}`}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(id)}
        aria-label={`Delete task "${title}"`}
        title="Delete task"
        className="btn btn--danger"
        style={{ alignSelf: 'start' }}
      >
        Delete
      </button>
    </li>
  );
}
