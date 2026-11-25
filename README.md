# FocusBoard

A responsive task management dashboard built with React. Users can create, edit, delete, search, filter and track tasks, see live progress statistics, browse a three-slide Focus Notes carousel, and keep their data between visits using `localStorage`.

- **Live app:** _add your Vercel/Netlify HTTPS URL here_
- **Repository:** _add your public GitHub URL here_

## Screenshots

Add screenshots to the `screenshots/` folder and link them here:

| Desktop (1440px) | Tablet (768px) | Mobile (390px) |
| --- | --- | --- |
| `screenshots/desktop.png` | `screenshots/tablet.png` | `screenshots/mobile.png` |

## Tech stack

React 18, Vite, JavaScript (ES6+), plain CSS with custom properties, React Hooks, `localStorage`, and Lucide React for icons. No Redux, backend or authentication, because the brief does not need them.

## Features

- Minimum of 8 sample tasks on first visit, with every status, priority and category represented
- Create, edit and delete tasks. Delete asks for confirmation first
- Three statuses (To do, In progress, Completed) changed from a dropdown on each task
- Case-insensitive, partial-match search by title
- Status tabs and a priority filter that work together with search, plus a reset button
- Statistics (total, in progress, completed, completion percentage) calculated from the task data
- Three-slide Focus Notes carousel with Previous/Next, clickable indicators, wrap-around and arrow-key support
- Saves to and restores from `localStorage`
- Responsive at 390px, 768px and 1440px
- Accessible: semantic HTML, labelled fields, keyboard operation, visible focus, focus-trapped dialogs, and status shown with text and icons as well as colour

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

```bash
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Project structure

```
focusboard/
├── public/favicon.svg
├── screenshots/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx         navigation, drawer on small screens
│   │   ├── Header.jsx          page title, date, menu button
│   │   ├── StatCard.jsx        one reusable statistic card
│   │   ├── FocusNotes.jsx      three-slide carousel
│   │   ├── SearchBar.jsx       title search input
│   │   ├── FilterTabs.jsx      status tabs, priority select, reset
│   │   ├── TaskList.jsx        list plus the two empty states
│   │   ├── TaskCard.jsx        one task row/card
│   │   ├── StatusBadge.jsx     status label with icon
│   │   ├── TaskForm.jsx        create AND edit form (modal)
│   │   └── ConfirmDialog.jsx   delete confirmation (modal)
│   ├── data/
│   │   ├── constants.js        statuses, priorities, categories, storage key
│   │   └── sampleTasks.js      initial tasks
│   ├── hooks/
│   │   ├── useLocalStorage.js  state that syncs with localStorage
│   │   └── useModal.js         focus trap, Escape, scroll lock, focus restore
│   ├── utils/                  date and id helpers
│   ├── App.jsx                 state, derived data and layout
│   ├── main.jsx
│   └── index.css               design tokens and all styles
├── README.md
├── AI_USAGE.md
└── package.json
```

## State management

I used built-in React state (`useState`, `useMemo`, `useEffect`) with no external library. The app is small and one component owns all the data, so passing props down is simpler and easier to follow than Redux or Context.

**Task data.** `App.jsx` holds one array, `tasks`, created by the `useLocalStorage` hook. It is the single source of truth. Everything else on screen is calculated from it.

**CRUD.** Each operation produces a new array with `setTasks`, never mutating the old one:
- Create: `[{ id: createId(), ...values }, ...current]`. The new task is added at the top.
- Edit: `current.map(task => task.id === id ? { ...task, ...values } : task)`. Only the matching task changes and its `id` is kept.
- Delete: `current.filter(task => task.id !== id)`, run only after the user confirms.
- Status change: the same `map` approach, updating only `status`.

`TaskForm` is one component for both create and edit. It receives `task` when editing and `null` when creating, and is mounted fresh each time it opens, so fields always start clean.

**Derived data.** Statistics and the visible list are computed with `useMemo` from `tasks` plus the filter state (`search`, `statusFilter`, `priorityFilter`). They are never stored separately, so they cannot drift out of sync.
- Completion % = `completed / total * 100`, rounded, and `0` when there are no tasks.
- Search and priority narrow the list first. The status tab then narrows it further. Tab counts are taken from the list before the status tab is applied, so each count matches what that tab will show.

**Carousel.** `FocusNotes` keeps its own `index` in `useState`. Navigation uses `(target + count) % count`, which makes it wrap around in both directions.

## localStorage

- Storage key: `focusboard_tasks`.
- On startup, `useLocalStorage` reads and parses the saved JSON. It is used only if it parses and passes `isValidTaskList`. Otherwise the app falls back to the sample tasks. This covers first visits, corrupted JSON and blocked storage.
- Sample data is only an initial value, so it never overwrites saved tasks. An empty saved list (the user deleted everything) stays empty after a refresh.
- A `useEffect` writes `JSON.stringify(tasks)` whenever `tasks` changes. Only the full task list is saved. Search text and filters are not.
- Reads and writes are wrapped in `try/catch`, so the app keeps working in memory if storage is unavailable.

## Matching the Figma design

The brief treats the Figma file as the visual source of truth. This build follows the structure and behaviour in the brief, and is set up so visual details are quick to adjust:

- **Colours, font, radii and tap size** are CSS variables at the top of `src/index.css`. Change them there first.
- **Focus Notes copy** is the `SLIDES` array at the top of `FocusNotes.jsx`. Replace it with the exact text from the three Figma frames.
- **Sidebar items** are the `NAV_ITEMS` array in `Sidebar.jsx`.
- **Breakpoints** are at the bottom of `index.css`: 480, 600, 768, 900, 1100 and 1280px.

## Deployment

Import the repository into Vercel or Netlify with these settings:

| Setting | Value |
| --- | --- |
| Framework | Vite |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |

## Known limitations

- Visual details (spacing, exact colours, icons, slide copy) have not been compared against the Figma file and may need adjusting.
- The sidebar has three links, all of which scroll to sections of this single page. There are no separate screens.
- Data is stored per browser. It does not sync between devices.
- When a new task is created, any active search or filters are cleared so the task is visible straight away.
