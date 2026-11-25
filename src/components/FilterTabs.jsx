import { RotateCcw } from 'lucide-react';
import { PRIORITIES, STATUSES } from '../data/constants.js';

const TABS = ['All', ...STATUSES];

export default function FilterTabs({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  counts,
  canReset,
  onReset,
}) {
  return (
    <div className="filters">
      <div className="tabs" role="group" aria-label="Filter by status">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`tab${status === tab ? ' tab--active' : ''}`}
            aria-pressed={status === tab}
            onClick={() => onStatusChange(tab)}
          >
            {tab}
            <span className="tab__count">{counts[tab]}</span>
          </button>
        ))}
      </div>

      <div className="filters__side">
        <label htmlFor="priority-filter" className="filters__label">
          Priority
        </label>
        <select
          id="priority-filter"
          className="select"
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value)}
        >
          <option value="All">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button type="button" className="btn btn--ghost" onClick={onReset} disabled={!canReset}>
          <RotateCcw size={16} aria-hidden="true" />
          Reset filters
        </button>
      </div>
    </div>
  );
}
