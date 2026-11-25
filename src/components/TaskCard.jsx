import { CalendarDays, Flag, Pencil, Trash2 } from 'lucide-react';
import { STATUSES } from '../data/constants.js';
import { formatDate, isOverdue } from '../utils/date.js';
import StatusBadge from './StatusBadge.jsx';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const overdue = isOverdue(task.dueDate, task.status);
  const titleId = `task-title-${task.id}`;
  const statusId = `task-status-${task.id}`;

  return (
    <article
      className={`task${task.status === 'Completed' ? ' task--done' : ''}`}
      aria-labelledby={titleId}
    >
      <div className="task__main">
        <h3 id={titleId} className="task__title">
          {task.title}
        </h3>
        {task.description && <p className="task__desc">{task.description}</p>}

        <div className="task__tags">
          <StatusBadge status={task.status} />
          <span className={`chip chip--priority-${task.priority.toLowerCase()}`}>
            <Flag size={14} aria-hidden="true" />
            {task.priority} priority
          </span>
          {task.category && <span className="chip chip--category">{task.category}</span>}
          {task.dueDate && (
            <span className={`chip ${overdue ? 'chip--overdue' : 'chip--due'}`}>
              <CalendarDays size={14} aria-hidden="true" />
              {overdue ? 'Overdue since' : 'Due'} {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="task__controls">
        <label htmlFor={statusId} className="sr-only">
          Change status of {task.title}
        </label>
        <select
          id={statusId}
          className="select"
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="icon-btn"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
          title="Edit task"
        >
          <Pencil size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onDelete(task)}
          aria-label={`Delete ${task.title}`}
          title="Delete task"
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
