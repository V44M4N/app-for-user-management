# User Management App

Full-stack user management sample with a React dashboard and Java Spring Boot API.

## Pages

- Dashboard with active users graph.
- Management & Controls with status filters and location filters.
- Disabled Users page for reviewing and re-enabling disabled accounts.

## Backend APIs

- `GET /api/dashboard` returns totals, active/disabled trends, role distribution, location stats, and recent activity.
- `GET /api/users?q=&role=&location=&active=` lists users with filters.
- `GET /api/users/locations` and `GET /api/users/roles` power frontend filter dropdowns.
- `PATCH /api/users/{id}/disable` and `PATCH /api/users/{id}/enable` update one account.
- `PATCH /api/users/bulk-disable` and `PATCH /api/users/bulk-enable` update selected accounts.
- `GET /api/audit-logs` returns recent enable/disable activity.
- `GET /api/users/export` downloads filtered users as CSV.

## Run

Start the Java backend:

```bash
cd backend
mvn spring-boot:run
```

Start the React frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.
