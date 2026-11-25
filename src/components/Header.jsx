import { Menu } from 'lucide-react';

export default function Header({ onMenuClick, menuOpen, menuButtonRef }) {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <header className="topbar">
      <button
        ref={menuButtonRef}
        type="button"
        className="icon-btn topbar__menu"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
        aria-controls="sidebar"
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      <div className="topbar__title">
        <h1>Dashboard</h1>
        <p>{today}</p>
      </div>

      <div className="avatar" role="img" aria-label="Your profile">
        ME
      </div>
    </header>
  );
}
