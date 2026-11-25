import { useEffect, useRef } from 'react';
import { LayoutDashboard, ListChecks, StickyNote, Target, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'My tasks', icon: ListChecks },
  { id: 'focus-notes', label: 'Focus notes', icon: StickyNote },
];

/**
 * Permanent sidebar on wide screens, slide-in drawer on tablet and mobile.
 * Each link jumps to a real section of the page.
 */
export default function Sidebar({ open, activeId, onNavigate, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  return (
    <aside id="sidebar" className={`sidebar${open ? ' sidebar--open' : ''}`} aria-label="Sidebar">
      <div className="sidebar__head">
        <a className="brand" href="#overview" onClick={() => onNavigate('overview')}>
          <span className="brand__mark" aria-hidden="true">
            <Target size={20} />
          </span>
          FocusBoard
        </a>
        <button
          ref={closeButtonRef}
          type="button"
          className="icon-btn sidebar__close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Main">
        <ul className="nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <a
                className="nav__link"
                href={`#${id}`}
                aria-current={activeId === id ? 'location' : undefined}
                onClick={() => onNavigate(id)}
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
