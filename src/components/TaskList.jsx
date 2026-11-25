import { Inbox, Plus, RotateCcw, SearchX } from 'lucide-react';
import TaskCard from './TaskCard.jsx';

export default function TaskList({
  tasks,
  totalCount,
  onEdit,
  onDelete,
  onStatusChange,
  onAdd,
  onReset,
}) {
  // No tasks exist at all.
  if (totalCount === 0) {
    return (
      <div className="empty">
        <div className="empty__icon" aria-hidden="true">
          <Inbox size={26} />
        </div>
        <h3>No tasks yet</h3>
        <p>Add your first task to start tracking what needs to get done.</p>
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          <Plus size={18} aria-hidden="true" />
          Add task
        </button>
      </div>
    );
  }

  // Tasks exist, but search or filters hide all of them.
  if (tasks.length === 0) {
    return (
      <div className="empty" role="status">
        <div className="empty__icon" aria-hidden="true">
          <SearchX size={26} />
        </div>
        <h3>No tasks match</h3>
        <p>Try a different title, or clear the filters to see all your tasks.</p>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          <RotateCcw size={16} aria-hidden="true" />
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="result-count" aria-live="polite">
        Showing {tasks.length} of {totalCount} {totalCount === 1 ? 'task' : 'tasks'}
      </p>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
