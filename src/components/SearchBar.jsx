import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <label htmlFor="task-search" className="sr-only">
        Search tasks by title
      </label>
      <Search className="search__icon" size={18} aria-hidden="true" />
      <input
        id="task-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tasks by title"
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="search__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
