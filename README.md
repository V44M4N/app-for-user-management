# User Management App

A full-stack user management application featuring a responsive **React (Vite)** analytical dashboard and a robust **Java Spring Boot REST API**.

---

## 🚀 Live Demo
* **Frontend UI (GitHub Pages):** [https://v44m4n.github.io/app-for-user-management/](https://v44m4n.github.io/app-for-user-management/)
* *Note: The backend service is currently hosted locally; full integration updates are in progress.*

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 18 (Vite)
* **Styling & Icons:** Lucide React, CSS3 Components
* **State & Networking:** Fetch API / Axios

### Backend
* **Framework:** Java Spring Boot
* **Build Tool:** Maven

---

## 📦 Features & Pages

### 1. Analytical Dashboard
* Real-time metrics visualization including total, active, and disabled accounts.
* Interactive graphical trends mapping user activity over time.
* Breakdown widgets for **Role Distribution** and **Location Statistics**.
* Live feed showcasing recent administrative actions.

### 2. User Management & Controls
* Global search functionality combined with multi-tier dropdown filtering (by **Role** and **Location**).
* Multi-select row mechanics enabling **Bulk Enable** and **Bulk Disable** operations.
* Instant single-account status toggling.
* Native data export directly to standard CSV format.

### 3. Archive & Compliance
* Dedicated **Disabled Users** interface designed to isolate inactive credentials.
* Streamlined account reactivation workflows.
* Audit trail logging tracking historical modifications for security profiling.

---

## 🔌 API Architecture

### Dashboard & Analytics
* `GET /api/dashboard` - Fetches high-level metrics, trend lines, role distribution charts, and recent audit alerts.

### Identity & Account Management
* `GET /api/users?q=&role=&location=&active=` - Returns filtered, searchable collections of users.
* `GET /api/users/locations` - Hydrates frontend location filter dropdown options.
* `GET /api/users/roles` - Hydrates frontend role management filters.
* `PATCH /api/users/{id}/disable` - Deactivates an isolated user profile.
* `PATCH /api/users/{id}/enable` - Activates an isolated user profile.

### Bulk Actions & Utilities
* `PATCH /api/users/bulk-disable` - Deactivates arrays of selected user IDs concurrently.
* `PATCH /api/users/bulk-enable` - Activates arrays of selected user IDs concurrently.
* `GET /api/audit-logs` - Streams full administrative history logs.
* `GET /api/users/export` - Compiles matching records into a download-ready CSV payload.

---

## 🔧 Local Development Setup

### Prerequisites
* **Node.js** (v18+)
* **Java Development Kit (JDK)** (v17+)
* **Maven**

### Clone the Repository
```bash
git clone [https://github.com/V44M4N/app-for-user-management.git](https://github.com/V44M4N/app-for-user-management.git)
cd app-for-user-management

