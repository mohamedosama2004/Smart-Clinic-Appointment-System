# Smart Clinic Appointment System (MVP)

A lightweight frontend-only web app to book, view, edit, and cancel clinic appointments using **Local Storage**.

## Live Scope (MVP)

- Simple login (UI only, no backend authentication)
- Dashboard summary
- Book appointment
- View appointment list
- Edit appointment
- Cancel appointment
- Duplicate slot prevention (same doctor + date + time)
- Local Storage persistence
- Basic form validation
- Responsive UI

## Tech Stack

- HTML
- CSS
- JavaScript (Vanilla)
- Browser Local Storage

## How to Run

1. Open `/home/runner/work/Smart-Clinic-Appointment-System/Smart-Clinic-Appointment-System/index.html` in a browser.
2. Login with any username and a role.
3. Use the dashboard and appointments screens.

## Functional Requirements Coverage

1. Login with username ✅
2. Create appointment ✅
3. Appointment fields (name, phone, doctor, date, time) ✅
4. View all appointments ✅
5. Edit appointment ✅
6. Cancel appointment ✅
7. Persist after refresh (Local Storage) ✅

## Product Development Deliverables

### 1) BRD (Business Requirements Document)

- **Problem**: Manual booking creates conflicts, missed appointments, and poor tracking.
- **Business Goal**: Digitize appointment lifecycle (book/view/edit/cancel) and reduce scheduling errors.
- **Success Indicators**:
  - Lower duplicate bookings
  - Faster booking and lookup
  - Improved receptionist workflow

### 2) PRD (Product Requirements Document)

- **Users**: Patient, Receptionist, Doctor (view-only)
- **Core Features**:
  - Login screen (UI-only)
  - Appointment CRUD operations
  - Dashboard metrics
  - Duplicate slot validation
  - Local persistence
- **Out of Scope**:
  - Payments, notifications, backend APIs, real auth, admin panel, multi-clinic setup

### 3) User Personas

- **Patient**: Wants quick appointment booking and clear appointment list.
- **Receptionist**: Needs fast scheduling and easy edits/cancellations.
- **Doctor**: Needs simple read-only view of booked schedule.

### 4) User Stories

- As a patient, I can create an appointment so I can visit the clinic.
- As a receptionist, I can edit appointments to handle changes.
- As a receptionist, I can cancel appointments when needed.
- As a doctor, I can view appointment records without editing.

### 5) Acceptance Criteria

- Given valid appointment data, when user submits, then appointment is saved.
- Given existing appointment in same doctor/date/time, when user submits duplicate, then system blocks save.
- Given saved appointments, when page reloads, then records remain visible.
- Given existing appointment, when user edits and saves, then updates persist.
- Given existing appointment, when user cancels, then record is removed.

### 6) Jira Epics

- EPIC-1: User Access (UI login)
- EPIC-2: Appointment Management (CRUD)
- EPIC-3: Data Persistence (Local Storage)
- EPIC-4: UX & Validation

### 7) Jira Tasks

- TASK-1: Build login page and role selector
- TASK-2: Build appointment form with validation
- TASK-3: Build appointment table/list screen
- TASK-4: Implement edit appointment flow
- TASK-5: Implement cancel appointment flow
- TASK-6: Add duplicate slot check
- TASK-7: Add Local Storage read/write layer
- TASK-8: Create dashboard summary cards
- TASK-9: Improve responsive styles

### 8) GitHub Repository

- Repository: `mohamedosama2004/Smart-Clinic-Appointment-System`

### 9) Frontend Prototype

- Implemented in:
  - `index.html`
  - `style.css`
  - `app.js`

## Notes

- No backend or external database is used.
- Authentication is intentionally UI-only for MVP learning scope.
