import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ClipboardList, Clock, Percent, Plus } from 'lucide-react';

import ConfirmDialog from './components/ConfirmDialog.jsx';
import FilterTabs from './components/FilterTabs.jsx';
import FocusNotes from './components/FocusNotes.jsx';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import StatCard from './components/StatCard.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import { STATUSES, STORAGE_KEY, isValidTaskList } from './data/constants.js';
import { SAMPLE_TASKS } from './data/sampleTasks.js';
import useLocalStorage from './hooks/useLocalStorage.js';
import { createId } from './utils/id.js';

export default function App() {
  // The single source of truth. Saved to localStorage on every change.
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, SAMPLE_TASKS, isValidTaskList);

  // Filter state. Visible tasks are derived from these, never stored.
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // UI state.
  const [form, setForm] = useState({ open: false, task: null });
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');
  const menuButtonRef = useRef(null);

  /* ---------- Derived data ---------- */

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'Completed').length;
    const inProgress = tasks.filter((task) => task.status === 'In progress').length;
    const todo = tasks.filter((task) => task.status === 'To do').length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, inProgress, todo, percent };
  }, [tasks]);

  const query = search.trim().toLowerCase();

  // Tasks that match the search text and priority (before the status tab).
  const matchingSearchAndPriority = useMemo(
    () =>
      tasks.filter(
        (task) =>
          (query === '' || task.title.toLowerCase().includes(query)) &&
          (priorityFilter === 'All' || task.priority === priorityFilter),
      ),
    [tasks, query, priorityFilter],
  );

  // Tab counts match exactly what each tab will show.
  const tabCounts = useMemo(() => {
    const counts = { All: matchingSearchAndPriority.length };
    STATUSES.forEach((status) => {
      counts[status] = matchingSearchAndPriority.filter((task) => task.status === status).length;
    });
    return counts;
  }, [matchingSearchAndPriority]);

  const visibleTasks = useMemo(
    () =>
      statusFilter === 'All'
        ? matchingSearchAndPriority
        : matchingSearchAndPriority.filter((task) => task.status === statusFilter),
    [matchingSearchAndPriority, statusFilter],
  );

  const hasActiveFilters = search !== '' || statusFilter !== 'All' || priorityFilter !== 'All';

  /* ---------- Filters ---------- */

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  /* ---------- Create, edit, delete, status ---------- */

  const openCreateForm = () => setForm({ open: true, task: null });
  const openEditForm = (task) => setForm({ open: true, task });
  const closeForm = () => setForm({ open: false, task: null });

  const handleSubmit = (values) => {
    if (form.task) {
      // Edit: replace only the matching task and keep its id.
      const { id } = form.task;
      setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...values } : task)));
    } else {
      // Create: add to the top, and clear filters so the new task is always visible.
      setTasks((current) => [{ id: createId(), ...values }, ...current]);
      resetFilters();
    }
    closeForm();
  };

  const confirmDelete = () => {
    const { id } = taskToDelete;
    setTasks((current) => current.filter((task) => task.id !== id));
    setTaskToDelete(null);
  };

  const changeStatus = (id, status) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, status } : task)));
  };

  /* ---------- Mobile navigation drawer ---------- */

  const closeNav = useCallback((returnFocus = false) => {
    setNavOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!navOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeNav(true);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navOpen, closeNav]);

  const handleNavigate = (id) => {
    setActiveNav(id);
    setNavOpen(false);
  };

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <Sidebar
        open={navOpen}
        activeId={activeNav}
        onNavigate={handleNavigate}
        onClose={() => closeNav(true)}
      />
      {navOpen && <div className="scrim" aria-hidden="true" onClick={() => closeNav(true)} />}

      <div className="shell">
        <Header
          menuOpen={navOpen}
          onMenuClick={() => setNavOpen(true)}
          menuButtonRef={menuButtonRef}
        />

        <main id="main" className="content" tabIndex={-1}>
          <section id="overview" aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="sr-only">
              Overview
            </h2>
            <div className="stats">
              <StatCard
                title="Total tasks"
                value={stats.total}
                icon={ClipboardList}
                tone="total"
                caption={`${stats.todo} still to do`}
              />
              <StatCard
                title="In progress"
                value={stats.inProgress}
                icon={Clock}
                tone="progress"
                caption="Being worked on now"
              />
              <StatCard
                title="Completed"
                value={stats.completed}
                icon={CheckCircle2}
                tone="done"
                caption="Finished tasks"
              />
              <StatCard
                title="Completion"
                value={`${stats.percent}%`}
                icon={Percent}
                tone="rate"
                caption={`${stats.completed} of ${stats.total} done`}
                progress={stats.percent}
              />
            </div>
          </section>

          <FocusNotes />

          <section id="tasks" className="panel" aria-labelledby="tasks-heading">
            <div className="panel__head">
              <div>
                <h2 id="tasks-heading">Tasks</h2>
                <p>Search, filter and update your work.</p>
              </div>
              <button type="button" className="btn btn--primary" onClick={openCreateForm}>
                <Plus size={18} aria-hidden="true" />
                Add task
              </button>
            </div>

            <div className="toolbar">
              <SearchBar value={search} onChange={setSearch} />
              <FilterTabs
                status={statusFilter}
                onStatusChange={setStatusFilter}
                priority={priorityFilter}
                onPriorityChange={setPriorityFilter}
                counts={tabCounts}
                canReset={hasActiveFilters}
                onReset={resetFilters}
              />
            </div>

            <TaskList
              tasks={visibleTasks}
              totalCount={tasks.length}
              onEdit={openEditForm}
              onDelete={setTaskToDelete}
              onStatusChange={changeStatus}
              onAdd={openCreateForm}
              onReset={resetFilters}
            />
          </section>
        </main>
      </div>

      {form.open && (
        <TaskForm
          key={form.task ? form.task.id : 'new'}
          task={form.task}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          title="Delete this task?"
          message={`“${taskToDelete.title}” will be removed. This can’t be undone.`}
          confirmLabel="Delete task"
          onConfirm={confirmDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </div>
  );
}
