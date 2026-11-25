import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES, PRIORITIES, STATUSES } from '../data/constants.js';
import useModal from '../hooks/useModal.js';

const EMPTY_VALUES = {
  title: '',
  description: '',
  category: CATEGORIES[1],
  status: STATUSES[0],
  priority: PRIORITIES[1],
  dueDate: '',
};

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Enter a task title.';
  if (!STATUSES.includes(values.status)) errors.status = 'Choose a status.';
  if (!PRIORITIES.includes(values.priority)) errors.priority = 'Choose a priority.';
  if (!values.dueDate) errors.dueDate = 'Choose a due date.';
  return errors;
}

function Field({ name, label, required, error, children }) {
  return (
    <div className="field">
      <label htmlFor={`task-${name}`}>
        {label}
        {required && (
          <span className="req" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`task-${name}-error`} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * One form for both flows: pass `task` to edit it, or null to create a new one.
 * The parent mounts it fresh each time it opens, so fields always start clean.
 */
export default function TaskForm({ task, onSubmit, onCancel }) {
  const isEditing = Boolean(task);
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  useModal(dialogRef, onCancel);

  const [values, setValues] = useState(() =>
    task
      ? {
          title: task.title,
          description: task.description ?? '',
          category: task.category ?? CATEGORIES[1],
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ?? '',
        }
      : EMPTY_VALUES,
  );
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const { [name]: removed, ...rest } = current;
        return rest;
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      formRef.current.elements.namedItem(Object.keys(found)[0])?.focus();
      return;
    }
    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    });
  };

  const aria = (name) => ({
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `task-${name}-error` : undefined,
  });

  return (
    <div className="overlay">
      <div
        ref={dialogRef}
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <div className="dialog__head">
          <h2 id="task-form-title">{isEditing ? 'Edit task' : 'Add a task'}</h2>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Close form">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form ref={formRef} className="form" onSubmit={handleSubmit} noValidate>
          <Field name="title" label="Title" required error={errors.title}>
            <input
              id="task-title"
              name="title"
              type="text"
              className="input"
              value={values.title}
              onChange={handleChange}
              maxLength={80}
              placeholder="What needs to get done?"
              autoComplete="off"
              aria-required="true"
              data-autofocus
              {...aria('title')}
            />
          </Field>

          <Field name="description" label="Description">
            <textarea
              id="task-description"
              name="description"
              className="input input--area"
              value={values.description}
              onChange={handleChange}
              maxLength={300}
              rows={3}
              placeholder="Add a few details (optional)"
            />
          </Field>

          <div className="form__row">
            <Field name="category" label="Category">
              <select
                id="task-category"
                name="category"
                className="select"
                value={values.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>

            <Field name="status" label="Status" required error={errors.status}>
              <select
                id="task-status"
                name="status"
                className="select"
                value={values.status}
                onChange={handleChange}
                aria-required="true"
                {...aria('status')}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="form__row">
            <Field name="priority" label="Priority" required error={errors.priority}>
              <select
                id="task-priority"
                name="priority"
                className="select"
                value={values.priority}
                onChange={handleChange}
                aria-required="true"
                {...aria('priority')}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </Field>

            <Field name="dueDate" label="Due date" required error={errors.dueDate}>
              <input
                id="task-dueDate"
                name="dueDate"
                type="date"
                className="input"
                value={values.dueDate}
                onChange={handleChange}
                aria-required="true"
                {...aria('dueDate')}
              />
            </Field>
          </div>

          <div className="dialog__actions">
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              {isEditing ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
