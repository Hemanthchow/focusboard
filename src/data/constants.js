export const STORAGE_KEY = 'focusboard_tasks';

export const STATUSES = ['To do', 'In progress', 'Completed'];
export const PRIORITIES = ['Low', 'Medium', 'High'];
export const CATEGORIES = ['Design', 'Development', 'Testing', 'Research', 'Other'];

/**
 * Guards against corrupted or hand-edited localStorage data.
 * Returns true only if the value is an array of well-formed tasks.
 */
export function isValidTaskList(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (task) =>
        task !== null &&
        typeof task === 'object' &&
        task.id !== undefined &&
        typeof task.title === 'string' &&
        STATUSES.includes(task.status) &&
        PRIORITIES.includes(task.priority),
    )
  );
}
