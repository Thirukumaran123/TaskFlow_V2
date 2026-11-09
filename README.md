# TaskFlow – Smart Task Management Web Application

> A professional, modern task management application inspired by Todoist, Notion, and enterprise productivity dashboards. Built with **React.js**, **Vite**, **HTML5**, **CSS3**, and **Lucide Icons**, featuring offline **LocalStorage persistence**, **Kanban drag-and-drop**, **interactive calendar**, **8 color themes**, and **comprehensive date-wise filtering**.

---

## 🌟 Key Highlights & Features

### 1. Executive Dashboard
- **Real-Time Statistics**: Total tasks, completed tasks, pending tasks, overdue tasks, today's tasks, upcoming tasks, and completion percentage.
- **Pure SVG Charts**:
  - Donut progress chart displaying completion velocity.
  - Priority distribution breakdown bars (Urgent, High, Medium, Low).
  - 7-Day activity velocity bar chart displaying tasks completed per day.
  - Category pill distribution counters.
- **Urgent & Critical Focus Section**: Highlights urgent, high-priority, and past-due items requiring immediate action.
- **Recently Updated Feed**: Quick access to recent items.

### 2. Complete Task Management (CRUD)
- **Create, Read, Update, Delete**: Form validation, error feedback, and confirmation modals.
- **Detailed Inspector Drawer**: Full task details, notes, timestamps, tags, and quick-action buttons.
- **Duplicate Tasks**: Instant one-click task cloning with `(Copy)` naming.
- **Completion Toggle & Confetti**: Celebrate completing tasks with smooth strike-through animations, audio chimes, and particle confetti.
- **Flexible Data Fields**: Unique ID, Title, Description, Category, Priority, Status, Start Date, Due Date, Reminder Date & Time, Tags chip array, and Multi-line Notes.

### 3. Date-Wise Task Management (All 15 Filters)
Zero-drift local date calculations to avoid timezone off-by-one errors:
1. **All Tasks**: Complete library.
2. **Today**: Tasks due on today's local date.
3. **Yesterday**: Tasks due yesterday.
4. **Previous Days**: Due before today.
5. **This Week**: Monday to Sunday of the current week.
6. **Last Week**: Monday to Sunday of the previous week.
7. **This Month**: 1st through the final day of current month.
8. **Previous Months**: Historical tasks prior to the 1st of the current month.
9. **Tomorrow**: Tasks due tomorrow.
10. **Upcoming Tasks**: All tasks scheduled for the future.
11. **Next 7 Days**: Horizon from today to 7 days ahead.
12. **Next 30 Days**: 30-day forecast.
13. **Overdue Tasks**: Tasks past due date that are not completed, with a 1-click **"Move to Today"** button.
14. **No Due Date**: Backlog items without deadlines.
15. **Custom Date Range**: From/To interactive HTML5 date pickers.

### 4. Priority-Wise Organization
- **4 Priority Tiers**:
  - 🔴 **Urgent / Critical**: Red (`#ef4444`)
  - 🟠 **High Priority**: Orange (`#f97316`)
  - 🔵 **Medium Priority**: Blue (`#3b82f6`)
  - 🟢 **Low Priority**: Green (`#10b981`)
- Default sorting with urgent tasks first, priority swimlanes, and dashboard breakdowns.

### 5. Multiple Task Views
- **List View**: Clean, compact list with quick checkboxes and action menus.
- **Kanban Board**: Drag-and-drop workflow across **To Do**, **In Progress**, and **Completed** columns, complete with quick move arrows for mobile and keyboard users.
- **Interactive Calendar**: Monthly, Weekly, and Daily calendar views with month navigation, today jump, task indicator dots, and date-click drawer.
- **Grouped by Date**: Categorized into Overdue, Today, Tomorrow, Upcoming, and No Due Date.
- **Grouped by Priority**: Swimlanes for Urgent, High, Medium, and Low.
- **Grouped by Category**: Personal, Work, Learning, Projects, Health, Shopping, Other.

### 6. Advanced Search & Combined Filtering
- **Multi-Field Instant Search**: Searches simultaneously across title, description, category, tags, and notes with a `/` keyboard shortcut.
- **Combined Filters**: Combine any Date filter + Priority filter + Category filter + Status filter simultaneously.
- **Multi-Criteria Sorting**: Urgent First, Due Date (Earliest / Latest), Created Date (Newest / Oldest), Recently Updated, Alphabetical (A-Z / Z-A).
- **Clear Filters**: 1-click reset button with dynamic active count badge.

### 7. 8 Built-in Themes & Custom Accent Picker
- **8 High-Contrast Themes**:
  1. `Light Theme` (Default clean productivity)
  2. `Dark Theme` (Sleek deep-night palette)
  3. `Ocean Blue` (Coastal deep blue)
  4. `Forest Green` (Serene botanical green)
  5. `Sunset Orange` (Warm energy)
  6. `Lavender Purple` (Modern lilac)
  7. `Rose Pink` (Warm blush)
  8. `Minimal Grey` (Monochrome clean aesthetic)
- **Custom Accent Color Picker**: Preset palette buttons + native color picker overriding CSS variables dynamically.
- **Instant Light/Dark Mode Toggle** in header.
- Persistent in LocalStorage via `data-theme` attribute and CSS custom properties.

### 8. Smart Reminders & Web Audio Chimes
- **Browser Push Notifications**: Integrated with the Web Notification API (`Notification.requestPermission()`).
- **Web Audio API Chimes**: Pure synthesized dual-tone alerts without external MP3 dependencies.
- **Background Checks**: Periodically verifies reminders and dispatches notifications when the application is open.

### 9. Data Management & Resilience
- **LocalStorage Abstraction**: Automatic saving, data migration, and corruption recovery.
- **Export Options**: Download all tasks as formatted **JSON** or spreadsheet-ready **CSV**.
- **JSON Import with Validation**: Validates schema and deduplicates IDs.
- **Sample Data Restore**: Pre-seeded with realistic interview-ready tasks.
- **Clear All**: Confirmation modal before deleting records.

---

## 📁 Project Architecture

```
taskflow/
├── public/
│   └── favicon.svg               # App brand SVG icon
├── src/
│   ├── components/
│   │   ├── CalendarView.jsx       # Month/Week/Day calendar with date drawer
│   │   ├── DashboardCard.jsx      # Metric stat card with icon & background
│   │   ├── DeleteConfirmModal.jsx # Confirmation dialog before deleting
│   │   ├── FilterPanel.jsx        # 15 date filters, priority, category, status, sort
│   │   ├── Header.jsx             # Top bar with search, date, notifications, quick add
│   │   ├── KanbanBoard.jsx        # Drag-and-drop Kanban board (To Do, In Progress, Done)
│   │   ├── PriorityBadge.jsx      # Colored badges for Urgent, High, Medium, Low
│   │   ├── SearchBar.jsx          # Instant search with keyboard shortcut
│   │   ├── Sidebar.jsx            # Left navigation with counters and completion bar
│   │   ├── StatisticsCharts.jsx   # Pure SVG Donut, 7-day velocity, priority bars
│   │   ├── TaskCard.jsx           # Task item with strike-through, tags, due date
│   │   ├── TaskDetailModal.jsx    # Notion-style detailed task inspector
│   │   ├── TaskList.jsx           # Flat and grouped task list rendering
│   │   ├── TaskModal.jsx          # Create/Edit task modal with validation
│   │   ├── ThemeSelector.jsx      # 8 themes + custom accent color picker
│   │   └── Toast.jsx              # Floating toast notification container
│   │
│   ├── context/
│   │   ├── TaskContext.jsx        # Central state, CRUD, filters, reminders
│   │   └── ThemeContext.jsx       # Theme state, CSS variable overrides
│   │
│   ├── hooks/
│   │   ├── useTasks.js            # Consumer hook for TaskContext
│   │   └── useTheme.js            # Consumer hook for ThemeContext
│   │
│   ├── pages/
│   │   ├── AllTasks.jsx           # All tasks with 6 view switcher modes
│   │   ├── CalendarPage.jsx       # Full-screen interactive calendar
│   │   ├── CategoriesPage.jsx     # Category management & workstreams
│   │   ├── Completed.jsx          # Completed tasks archive with timestamps
│   │   ├── Dashboard.jsx          # Executive overview, metrics, charts
│   │   ├── MyDay.jsx              # Today's daily focus & overdue alert
│   │   ├── Overdue.jsx            # Overdue tasks with 1-click reschedule
│   │   ├── PriorityPage.jsx       # 4 priority swimlanes
│   │   ├── Settings.jsx           # Preferences, themes, export/import, backup
│   │   └── Upcoming.jsx           # Forecast horizons (Tomorrow, 7d, 30d, Later)
│   │
│   ├── styles/
│   │   ├── global.css             # Base design system, typography, cards, buttons
│   │   ├── responsive.css         # Mobile drawer, grid wraps, touch styles
│   │   └── themes.css             # 8 theme tokens & CSS custom variables
│   │
│   ├── utils/
│   │   ├── dateUtils.js           # Timezone-safe date calculations & 15 filters
│   │   ├── notificationUtils.js   # Web Audio synthesizer chime & Notification API
│   │   ├── storageUtils.js        # LocalStorage, JSON/CSV export, validation
│   │   └── taskUtils.js           # Multi-criteria filtering, sorting, grouping, stats
│   │
│   ├── App.jsx                    # Root component connecting layouts & modals
│   ├── index.css                  # Clean root layout reset
│   └── main.jsx                   # React 18 / 19 entry point
│
├── index.html                     # HTML5 shell
├── package.json                   # Dependencies: react, lucide-react, canvas-confetti
├── vite.config.js                 # Vite config
└── README.md                      # Comprehensive documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run

1. **Clone or Extract the Project**:
   ```bash
   cd taskflow
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   The production-ready assets will be generated in the `dist/` directory.

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 💡 Developer Interview Talking Points

- **Timezone-Safe Date Math**: Avoids standard `new Date("YYYY-MM-DD")` UTC midnight drift errors by explicitly parsing local year, month, and day components.
- **Architected for Future Backend Integration**: The data layer in `TaskContext` and `storageUtils` mirrors RESTful CRUD patterns, making replacement with Axios/Fetch API trivial.
- **CSS Variable Design Tokens**: Zero heavy styling frameworks; uses pure CSS variables enabling instantaneous theme and accent color switching with zero flash or stylesheet re-downloads.
- **Performance & Memoization**: Employs `useMemo` for filtering and sorting computations, ensuring smooth performance even with hundreds of tasks.
- **Accessibility & UX**: Keyboard shortcuts (`/` for search, `Ctrl+Enter` to save, `Esc` to close), smooth drag-and-drop Kanban, accessible contrast ratios, and responsive mobile drawers.
