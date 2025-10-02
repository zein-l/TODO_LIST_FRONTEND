# To-Do List (React + Vite)

Simple, responsive To-Do app with filters, dark mode, persistence, due dates, undo, animations, and tests.

**Live demo:** https://zein-l.github.io/TODO_LIST_FRONTEND/

---

## ✨ Features

- **Core**
  - Add a task (title required, optional description)
  - Mark complete / Delete
  - Filter: **All / Active / Completed**
- **UI/UX**
  - Clean, responsive layout (mobile + desktop)
  - Visual distinction between completed vs active
  - **Dark mode** (manual toggle + persisted preference)
  - **Delightful animations** (add/toggle/delete)
  - **Accessible**: labeled controls, focus rings, `aria-live` updates
  - **Smart copy**:
    - Dynamic tagline (changes in dark mode)
    - Fun placeholders
    - “Far-future” due date gag banner
- **Bonus**
  - **localStorage** persistence (with safe parsing)
  - **Due date** support + **sorting** (Overdue → Soonest → No date)
  - **Badges**: Overdue / Due today
  - **Undo delete** (toast with Undo, works before/after removal)
  - **Unit tests** (Jest + React Testing Library)
  - **Dark mode** persisted & respects system preference
  - **Keyboard shortcuts**:
    - `Enter` on title submits task
    - `Ctrl/Cmd + D` toggles dark mode

---

## 🧪 Testing

- Unit tests: Jest + React Testing Library  
  - `src/__tests__/App.test.jsx` – header  
  - `src/__tests__/TaskInput.test.jsx` – add task  
  - `src/__tests__/TaskActions.test.jsx` – toggle, delete, filter  
  - `src/__tests__/DarkMode.test.jsx` – dark class & label  
  - `src/__tests__/Persistence.test.jsx` – localStorage read/write  

Run:
```bash
npm run test
npm run test -- --watchAll
npm run test:coverage
```

---

## 🛠️ Tech Stack

- React 19 + Vite 7  
- Vanilla CSS with CSS variables (light/dark)  
- Jest + React Testing Library  


---

## 📁 Structure

```
src/
  components/
    TaskInput.jsx
    TaskItem.jsx
  __tests__/
    App.test.jsx
    TaskInput.test.jsx
    TaskActions.test.jsx
    DarkMode.test.jsx
    Persistence.test.jsx
  App.jsx
  App.css
  main.jsx
  index.css
```

---

## ▶️ Local Setup

```bash
# install
npm install

# run dev server
npm run dev

# build
npm run build

# preview production build
npm run preview
```

---

## 🔒 Decisions & Notes

- State is minimal; tasks serialized to localStorage with shape checks.  
- Sorting is predictable: Overdue → earliest due → undated.  
- Undo is robust: we keep a backup, schedule deletion after exit animation, and cancel/reinsert on Undo.  
- Styling uses variables for theme tokens (light/dark) and responsive layout.  
- Accessibility: tied labels, visible focus rings, polite aria-live announcements for counts.  
