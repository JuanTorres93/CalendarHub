# 🗓️ CalendarHub

A modular, local-first calendar application built from scratch with vanilla JavaScript.

CalendarHub provides synchronized Month, Week, and Daily calendar views, advanced recurring events, date-based ToDo lists, contextual event management, browser notifications, and persistent local data.

The project was developed as a long-term JavaScript learning project and is now considered feature-complete for its current scope with the release of version 1.0.

---

## 🚀 Live Demo

➡️ [Open CalendarHub Demo](https://manuelcappai94.github.io/CalendarHub/)

---

## ✅ Project Status

**Current version: v1.0.0**

CalendarHub has reached its intended final scope.

The application is complete and no active feature roadmap is currently planned. Future updates, if any, will focus on maintenance and bug fixes rather than additional web features.

---

## ⚙️ Features

### Calendar views

- Fully synchronized Month, Week, and Daily views
- Previous and next period navigation
- Current-day highlighting
- Active-date selection
- Interactive hourly grids
- Responsive desktop and mobile layouts

### Event management

- Event creation, editing, and deletion
- Preloaded date and time based on the selected calendar cell
- Custom title, description, icon, and category color
- Urgent and all-day event options
- Configurable notification timing
- Contextual event information banner
- Quick event actions
- Editing and deletion of individual events or recurring series

### Recurring events

- Daily recurrence
- Weekly recurrence
- Monthly recurrence
- Custom selected dates
- Configurable recurrence intervals
- Multiple weekday selection
- Optional end date
- Runtime occurrence generation
- Single-occurrence editing
- Single-occurrence deletion
- Exception-based recurring series management

### To-do lists

- Date-based ToDo lists
- Multiple lists for the same date
- Activity creation and deletion
- Completion tracking
- Automatic progress counter
- Full-list deletion
- Saved-list rehydration
- Calendar indicators across Month, Week, and Daily views
- Contextual menu for reopening saved lists

### Browser notifications

- Native browser and operating-system notifications
- Configurable notification advance time
- Persistent enabled/disabled preference
- Automatic scheduler restoration when CalendarHub is reopened
- Responsive notification toggle
- Prevention of duplicate notifications
- Support for multiple events scheduled at the same time

### Navigation and onboarding

- Interactive mini calendar
- Manual date input
- Month and year selectors
- Dedicated onboarding tutorial
- Chapter-based tutorial navigation
- Tutorial sections for events, recurrence, ToDo lists, and notifications

---

## 🧠 Technical Highlights

- Modular vanilla JavaScript architecture
- Centralized calendar date synchronization
- Dynamic rendering across multiple views
- Runtime recurring-event generation
- Exception-based recurring-event handling
- Context-aware modal initialization
- Reusable event and ToDo rendering
- Dynamic UI list generation
- Local browser persistence
- Persistent application preferences
- Native browser notification scheduling
- Responsive modal and floating-interface positioning
- Semantic HTML and accessibility-oriented improvements

---

## 🔒 Security and Data Validation

CalendarHub includes targeted security and data-integrity protections.

### Safe DOM rendering

User-generated content is rendered through safe DOM and text APIs rather than being inserted as executable HTML.

This applies to:

- Event titles and descriptions
- ToDo list titles
- ToDo activities
- Event information banners
- Recurring-event data

### localStorage validation

Stored events and ToDo data are validated when read and before being written.

The validation system checks:

- Required fields
- Expected data types
- Date formats
- Time formats
- Recurrence configurations
- Weekday values
- Custom recurrence dates
- ToDo list and activity structures

Invalid or corrupted stored entries are rejected or filtered instead of being trusted automatically.

### Local data

CalendarHub does not require an account or external database.

Events, ToDo lists, notification preferences, and application data are stored locally in the user's browser through `localStorage`.

---

## 🔔 Browser Notification System

CalendarHub can send a notification before an event begins.

Users can select one of the available advance times:

- No notification
- 5 minutes before
- 15 minutes before
- 1 hour before
- 2 hours before
- 4 hours before
- 24 hours before

Notifications can be enabled or disabled using the bell button in the navigation bar.

The application stores the user's CalendarHub notification preference, while the browser remains responsible for granting or denying the actual permission.

### Notification limitations

- Browser permission is required.
- CalendarHub must remain open for the web scheduler to run.
- Desktop browsers provide the intended notification experience.
- Mobile-browser notification behavior and support may vary.
- CalendarHub does not currently use push notifications or a service worker for background delivery.

---

## 🔁 Recurring Event System

CalendarHub avoids storing every generated occurrence as an independent event.

Instead, the application stores the original recurring event and generates its visible occurrences at runtime before rendering them across Month, Week, and Daily views.

The recurrence system supports:

- Daily patterns
- Weekly patterns
- Monthly patterns
- Custom dates
- Recurrence intervals
- Multiple selected weekdays
- End-date limitations

When a single occurrence is edited or deleted, CalendarHub preserves the original recurring series and records the affected date as an exception.

This allows a single occurrence to behave independently without breaking the rest of the recurring series.

---

## ✅ ToDo List System

The ToDo system is integrated directly into the calendar date flow.

Users can:

- Create lists for the selected date
- Add multiple activities
- Mark activities as completed
- Restore completed activities
- Delete individual activities
- Delete entire lists
- Reopen stored lists from calendar indicators

The same ToDo information is synchronized across Month, Week, and Daily views without duplicating the stored data.

---

## 🧭 Tutorial System

CalendarHub includes an onboarding tutorial that explains the main application features.

The tutorial covers:

- Calendar navigation
- Month, Week, and Daily views
- Mini-calendar usage
- Event creation
- Recurring events
- Contextual event actions
- ToDo lists
- Browser notifications

Users can move between tutorial chapters and restart the guide from the navigation bar.

---

## 🚀 Version 1.0

Version 1.0 completes the intended CalendarHub feature set.

Main additions and improvements:

- Native browser event notifications
- Configurable notification advance times
- Persistent notification preference
- Automatic notification-scheduler restoration
- Responsive notification toggle
- Duplicate-notification prevention
- Hardened event and ToDo localStorage validation
- Write-side validation before persistence
- Removal of legacy global date state
- Removal of obsolete persistent date state
- Improved semantic HTML structure
- Improved labels for interactive controls
- Improved dynamically generated interface labels
- Updated notification tutorial
- Updated metadata and favicon
- Final responsive and code cleanup

---

## 📚 Previous Milestones

### v0.9.2 — Security and rendering refactor

- Fixed stored DOM XSS risks in event rendering
- Reworked the event information banner
- Fixed unsafe ToDo activity rendering
- Replaced unnecessary dynamic HTML with DOM and text APIs
- Hardened event-draft rehydration
- Refactored custom recurrence date rendering

### v0.9.1 – Dependency setup refactor and info banner fix

- Migrated Day.js to npm package imports
- Added Vite as development and build tooling
- Added `package.json` and `package-lock.json`
- Added dependency and build-output exclusions
- Removed legacy local Day.js files
- Fixed contextual banner positioning near viewport boundaries

### v0.9 – ToDo List, tutorial navigation and UI refinement

- Added the complete date-based ToDo system
- Added ToDo persistence and rehydration
- Added activity completion tracking
- Added calendar ToDo indicators
- Added tutorial chapter navigation
- Improved navbar semantics
- Added accessible labels to icon-based controls
- Improved mini-calendar integration

---



## 🖼️ Preview

### 📅 Month View

![Month View](./public/images/screenshots/month.jpeg)

### 📆 Week View

![Week View](./public/images/screenshots/week+events.png)

### 📆 Daily View + Event System

![Daily View](./public/images/screenshots/modal+daily.png)

### 📌 Contextual Info Banner

![Contextual Info Banner](./public/images/screenshots/contextual_info_banner.png)

---

## 🧩 Tech Stack

* JavaScript ES6+
* HTML5
* CSS3
* CSS Grid
* Flexbox
* Day.js
* npm
* Vite
* localStorage
- Web Notifications API

---

## 🛠️ Installation & Local Development

Clone the repository:

git clone https://github.com/ManuelCappai94/CalendarHub.git
cd CalendarHub

- Install dependencies:

- npm install

- Start the development server:

- npm run dev

- Build the project for production:

- npm run build

- Preview the production build locally:

- npm run preview

Vite is used only for development and production builds. The deployed version remains a static client-side web application.

---

## 🧩 Assets & Credits
* Interface icons from [Lucide](https://lucide.dev/)
* Trash bin icon by [dDara](https://www.freepik.com/icon/bin_2602768) under Freepik License
* Custom icons and textures created with Piskel

