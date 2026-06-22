import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Ban,
  Check,
  Download,
  Edit3,
  LayoutDashboard,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Users
} from "lucide-react";
import "./styles.css";

const API_URL = "http://localhost:8080/api";
const SAMPLE_USERS = [
  { id: 1, name: "Aarav Mehta", email: "aarav@example.com", role: "Admin", location: "Mumbai", joined: "Jan 12, 2024", lastActive: "Today", active: true },
  { id: 2, name: "Priya Nair", email: "priya@example.com", role: "Manager", location: "Bengaluru", joined: "Mar 3, 2024", lastActive: "Yesterday", active: true },
  { id: 3, name: "Rohan Shah", email: "rohan@example.com", role: "User", location: "Delhi", joined: "Feb 18, 2024", lastActive: "2 months ago", active: false },
  { id: 4, name: "Neha Rao", email: "neha@example.com", role: "User", location: "Hyderabad", joined: "Apr 5, 2024", lastActive: "Today", active: true },
  { id: 5, name: "Kabir Khan", email: "kabir@example.com", role: "Manager", location: "Pune", joined: "Nov 22, 2023", lastActive: "3 hours ago", active: true },
  { id: 6, name: "Anika Singh", email: "anika@example.com", role: "User", location: "Chennai", joined: "May 1, 2024", lastActive: "45 days ago", active: false },
  { id: 7, name: "Dev Patel", email: "dev@example.com", role: "User", location: "Mumbai", joined: "Jun 9, 2024", lastActive: "Today", active: true },
  { id: 8, name: "Mira Das", email: "mira@example.com", role: "Admin", location: "Kolkata", joined: "Aug 11, 2024", lastActive: "1 hour ago", active: true }
];
const SAMPLE_LOCATIONS = [...new Set(SAMPLE_USERS.map((user) => user.location))].sort();
const SAMPLE_ROLES = [...new Set(SAMPLE_USERS.map((user) => user.role))].sort();
const SAMPLE_DASHBOARD = {
  totalUsers: SAMPLE_USERS.length,
  activeUsers: SAMPLE_USERS.filter((user) => user.active).length,
  disabledUsers: SAMPLE_USERS.filter((user) => !user.active).length,
  newToday: 3,
  activeTrend: [1420, 1480, 1510, 1590, 1650, 1700, 1730, 1780, 1800, 1840, 1870, 1893]
};
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DISABLED_TREND = [80, 88, 92, 98, 106, 112, 118, 126, 132, 138, 144, 148];

function useApi(path, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}${path}`);
      if (!response.ok) throw new Error("Request failed");
      setData(await response.json());
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [path]);

  return { data, loading, error, reload: load };
}

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo">
          <div className="logoText"><ShieldCheck size={15} /> UserCore</div>
          <div className="logoSub">Admin panel</div>
        </div>
        <nav>
          <NavButton active={page === "dashboard"} icon={<LayoutDashboard />} onClick={() => setPage("dashboard")}>
            Dashboard
          </NavButton>
          <NavButton active={page === "management"} icon={<SlidersHorizontal />} onClick={() => setPage("management")}>
            Management
          </NavButton>
          <NavButton active={page === "users"} icon={<Users />} onClick={() => setPage("users")}>
            Users
          </NavButton>
        </nav>
        <div className="adminCard">
          <Avatar name="Super Admin" role="Admin" />
          <div>
            <div className="adminName">Super Admin</div>
            <div className="adminEmail">admin@usercore.io</div>
          </div>
        </div>
      </aside>

      <main className="main">
        {page === "dashboard" && <Dashboard />}
        {page === "management" && <Management />}
        {page === "users" && <UsersPage />}
      </main>
    </div>
  );
}

function NavButton({ active, children, icon, onClick }) {
  return (
    <button className={active ? "navItem active" : "navItem"} onClick={onClick}>
      {React.cloneElement(icon, { size: 16 })}
      {children}
    </button>
  );
}

function Dashboard() {
  const { data, loading, error, reload } = useApi("/dashboard", SAMPLE_DASHBOARD);
  const trend = normalizeTrend(data.activeTrend, data.activeUsers);
  const disabledTrend = data.disabledTrend || DISABLED_TREND;
  const previousValue = trend.at(-2) || trend[0] || 0;
  const currentValue = trend.at(-1) || 0;
  const trendChange = currentValue - previousValue;
  const trendPercent = previousValue ? ((trendChange / previousValue) * 100).toFixed(1) : "0.0";

  return (
    <section className="page">
      <PageHeader title="Dashboard" subtitle="Platform overview - last 30 days">
        <button className="btn btnSm" onClick={reload}><RefreshCw size={13} /> Refresh</button>
      </PageHeader>
      <Status loading={loading} error={error} />
      <div className="metrics">
        <Metric label="Total users" value={data.totalUsers || data.activeUsers + data.disabledUsers} delta="+8 this month" />
        <Metric label="Active users" value={data.activeUsers} delta="+3.2%" />
        <Metric label="Disabled" value={data.disabledUsers} delta="+2 flagged" negative />
        <Metric label="New today" value={data.newToday || 3} delta="vs 2 yesterday" />
      </div>
      <div className="chartsRow">
        <div className="card">
          <div className="chartHeader">
            <div>
              <div className="cardTitle">Active users - last 12 months</div>
              <div className="chartSub">Monthly active accounts compared with disabled accounts</div>
            </div>
            <div className="chartSummary">
              <strong>{formatNumber(currentValue)}</strong>
              <span className={trendChange >= 0 ? "summaryUp" : "summaryDown"}>
                {trendChange >= 0 ? "+" : ""}{formatNumber(trendChange)} ({trendPercent}%)
              </span>
            </div>
          </div>
          <DetailedLineChart activeValues={trend} disabledValues={disabledTrend} labels={MONTH_LABELS} />
          <div className="chartInsights">
            <Insight label="Peak month" value={MONTH_LABELS[indexOfMax(trend)]} detail={formatNumber(Math.max(...trend))} />
            <Insight label="Lowest month" value={MONTH_LABELS[indexOfMin(trend)]} detail={formatNumber(Math.min(...trend))} />
            <Insight label="Avg active" value={formatNumber(Math.round(average(trend)))} detail="per month" />
          </div>
        </div>
        <div className="card">
          <div className="cardTitle">Users by role</div>
          <DonutChart />
          <div className="legend">
            <Legend color="#378add" label="Users 68%" />
            <Legend color="#7f77dd" label="Managers 20%" />
            <Legend color="#1d9e75" label="Admins 12%" />
          </div>
        </div>
      </div>
      <div className="card">
        <div className="cardTitle">Registrations by location</div>
        <div className="locationGrid">
          {[
            ["Mumbai", 641, "100%"],
            ["Bengaluru", 498, "78%"],
            ["Delhi", 312, "49%"],
            ["Hyderabad", 274, "43%"],
            ["Others", 756, "100%"]
          ].map(([location, value, width]) => (
            <div className="locationStat" key={location}>
              <span>{location}</span>
              <strong>{value}</strong>
              <i style={{ width }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Management() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [selected, setSelected] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const users = useApi("/users", SAMPLE_USERS);
  const locations = useApi("/users/locations", SAMPLE_LOCATIONS);
  const roles = useApi("/users/roles", SAMPLE_ROLES);

  const filteredUsers = useMemo(() => filterUsers(users.data, { query, role, status, location }), [users.data, query, role, status, location]);

  async function disableUsers(ids) {
    await updateUserStatus(ids, false);
    setSelected([]);
    users.reload();
  }

  async function enableUsers(ids) {
    await updateUserStatus(ids, true);
    setSelected([]);
    users.reload();
  }

  function resetFilters() {
    setQuery("");
    setRole("");
    setStatus("");
    setLocation("");
  }

  return (
    <section className="page">
      <PageHeader title="Management" subtitle="Controls, filters, and bulk actions">
        <button className="btn btnPrimary btnSm"><Plus size={13} /> Add user</button>
      </PageHeader>
      <FilterBar
        query={query}
        role={role}
        status={status}
        location={location}
        locations={locations.data}
        roles={roles.data}
        onQuery={setQuery}
        onRole={setRole}
        onStatus={setStatus}
        onLocation={setLocation}
        onReset={resetFilters}
      />
      <Status loading={users.loading} error={users.error || locations.error || roles.error} />
      <TableToolbar
        count={`Showing ${filteredUsers.length} of ${users.data.length} users`}
        selected={selected}
        onBulkDisable={() => setConfirmAction({ ids: selected, label: `Disable ${selected.length} selected users?`, onConfirm: () => disableUsers(selected) })}
        onExport={() => exportUsersCsv({ query, role, status, location })}
      />
      <UserTable
        users={filteredUsers}
        selected={selected}
        onSelect={setSelected}
        onDisable={(user) => setConfirmAction({ ids: [user.id], label: `Disable ${user.name}?`, onConfirm: () => disableUsers([user.id]) })}
        onEnable={(user) => enableUsers([user.id])}
        showLastActive
      />
      <ConfirmModal action={confirmAction} onClose={() => setConfirmAction(null)} />
    </section>
  );
}

function UsersPage() {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [selected, setSelected] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const users = useApi("/users", SAMPLE_USERS);
  const locations = useApi("/users/locations", SAMPLE_LOCATIONS);
  const roles = useApi("/users/roles", SAMPLE_ROLES);

  const filteredUsers = useMemo(() => {
    const status = tab === "all" ? "" : tab;
    return filterUsers(users.data, { query, role, status, location });
  }, [users.data, query, role, tab, location]);

  async function updateUsers(ids, active) {
    await updateUserStatus(ids, active);
    setSelected([]);
    users.reload();
  }

  return (
    <section className="page">
      <PageHeader title="Users" subtitle="Manage accounts - enable or disable access">
        <button className="btn btnPrimary btnSm"><Plus size={13} /> Add user</button>
      </PageHeader>
      <div className="tabs">
        {["all", "active", "disabled"].map((item) => (
          <button className={tab === item ? "tab active" : "tab"} key={item} onClick={() => setTab(item)}>
            {item === "all" ? "All users" : item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
      <FilterBar
        query={query}
        role={role}
        location={location}
        locations={locations.data}
        roles={roles.data}
        onQuery={setQuery}
        onRole={setRole}
        onLocation={setLocation}
      />
      <Status loading={users.loading} error={users.error || locations.error || roles.error} />
      <TableToolbar
        count={`${filteredUsers.length} user${filteredUsers.length === 1 ? "" : "s"} shown`}
        selected={selected}
        onBulkDisable={() => setConfirmAction({ ids: selected, label: `Disable ${selected.length} selected users?`, onConfirm: () => updateUsers(selected, false) })}
        onBulkEnable={() => updateUsers(selected, true)}
        onExport={() => exportUsersCsv({ query, role, status: tab === "all" ? "" : tab, location })}
        users={users.data}
      />
      <UserTable
        users={filteredUsers}
        selected={selected}
        onSelect={setSelected}
        onDisable={(user) => setConfirmAction({ ids: [user.id], label: `Disable ${user.name}?`, onConfirm: () => updateUsers([user.id], false) })}
        onEnable={(user) => updateUsers([user.id], true)}
      />
      <ConfirmModal action={confirmAction} onClose={() => setConfirmAction(null)} />
    </section>
  );
}

function FilterBar({ query, role, status, location, locations, roles, onQuery, onRole, onStatus, onLocation, onReset }) {
  return (
    <div className="filters">
      {onReset && <span className="filterLabel">Filter:</span>}
      <label className="searchWrap">
        <Search size={14} />
        <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search name or email" />
      </label>
      <select value={role} onChange={(event) => onRole(event.target.value)}>
        <option value="">All roles</option>
        {roles.map((item) => <option key={item}>{item}</option>)}
      </select>
      {onStatus && (
        <select value={status} onChange={(event) => onStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      )}
      <select value={location} onChange={(event) => onLocation(event.target.value)}>
        <option value="">All locations</option>
        {locations.map((item) => <option key={item}>{item}</option>)}
      </select>
      {onReset && <button className="btn btnSm" onClick={onReset}>Clear</button>}
    </div>
  );
}

function TableToolbar({ count, selected, onBulkDisable, onBulkEnable, onExport, users = [] }) {
  const selectedUsers = users.filter((user) => selected.includes(user.id));
  const hasActive = users.length ? selectedUsers.some((user) => user.active) : selected.length > 0;
  const hasDisabled = selectedUsers.some((user) => !user.active);

  return (
    <div className="tableToolbar">
      <span>{count}</span>
      <div className="toolbarActions">
        <button className="btn btnSm" onClick={onExport}><Download size={13} /> Export</button>
        {hasActive && <button className="btn btnDanger btnSm" onClick={onBulkDisable}><Ban size={13} /> Disable selected</button>}
        {hasDisabled && onBulkEnable && <button className="btn btnSm successBtn" onClick={onBulkEnable}><Check size={13} /> Enable selected</button>}
      </div>
    </div>
  );
}

function UserTable({ users, selected, onSelect, onDisable, onEnable, showLastActive = false }) {
  const allSelected = users.length > 0 && users.every((user) => selected.includes(user.id));

  function toggleAll(checked) {
    onSelect(checked ? users.map((user) => user.id) : []);
  }

  function toggleOne(id, checked) {
    onSelect(checked ? [...selected, id] : selected.filter((item) => item !== id));
  }

  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" checked={allSelected} onChange={(event) => toggleAll(event.target.checked)} /></th>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Location</th>
            <th>Joined</th>
            {showLastActive && <th>Last active</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr><td className="empty" colSpan={showLastActive ? 8 : 7}>No users found.</td></tr>
          )}
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input type="checkbox" checked={selected.includes(user.id)} onChange={(event) => toggleOne(user.id, event.target.checked)} />
              </td>
              <td>
                <div className="userCell">
                  <Avatar name={user.name} role={user.role} />
                  <div>
                    <div className="userName">{user.name}</div>
                    <div className="userEmail">{user.email}</div>
                  </div>
                </div>
              </td>
              <td><Badge type={roleClass(user.role)}>{user.role}</Badge></td>
              <td><Badge type={user.active ? "active" : "disabled"}>{user.active ? "Active" : "Disabled"}</Badge></td>
              <td><span className="tag"><MapPin size={10} /> {user.location}</span></td>
              <td className="muted">{user.joined || joinedDate(user.id)}</td>
              {showLastActive && <td className="muted">{user.lastActive || lastActive(user.id, user.active)}</td>}
              <td>
                <div className="actionBtns">
                  {user.active ? (
                    <button className="btn btnSm btnDanger" onClick={() => onDisable(user)}><Ban size={13} /> Disable</button>
                  ) : (
                    <button className="btn btnSm successBtn" onClick={() => onEnable?.(user)}><Check size={13} /> Enable</button>
                  )}
                  <button className="btn btnSm" aria-label="Edit user"><Edit3 size={13} /></button>
                  <button className="btn btnSm trashBtn" aria-label="Delete user"><Trash2 size={13} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConfirmModal({ action, onClose }) {
  if (!action) return null;
  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalTitle">{action.label}</div>
        <div className="modalBody">This will immediately revoke access. You can re-enable users at any time.</div>
        <div className="modalActions">
          <button className="btn btnSm" onClick={onClose}>Cancel</button>
          <button className="btn btnDanger btnSm" onClick={() => { action.onConfirm(); onClose(); }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, delta, negative = false }) {
  return (
    <div className="metric">
      <div className="metricLabel">{label}</div>
      <div className="metricVal">{value}</div>
      <div className={negative ? "metricDelta negative" : "metricDelta"}>{delta}</div>
    </div>
  );
}

function DetailedLineChart({ activeValues, disabledValues, labels }) {
  const chart = buildChart(activeValues, disabledValues, labels);

  return (
    <div className="activeChart">
      <div className="chartLegend">
        <Legend color="#378add" label="Active users" />
        <Legend color="#d85a30" label="Disabled users" dashed />
      </div>
      <div className="chartCanvas">
        <div className="yAxis">
          {chart.ticks.map((tick) => <span key={tick}>{formatNumber(tick)}</span>)}
        </div>
        <svg className="lineChart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Active users trend chart">
          <defs>
            <linearGradient id="activeFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#378add" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#378add" stopOpacity="0" />
            </linearGradient>
          </defs>
          {chart.ticks.map((tick) => (
            <line className="gridLine" key={tick} x1="0" x2="100" y1={chart.y(tick)} y2={chart.y(tick)} />
          ))}
          <polygon className="areaFill" points={`0,92 ${chart.activePoints} 100,92`} />
          <polyline className="activeLine" points={chart.activePoints} />
          <polyline className="disabledLine" points={chart.disabledPoints} />
          {chart.activeDots.map((dot) => (
            <g key={dot.label}>
              <circle className={dot.isPeak ? "peakDot" : "activeDot"} cx={dot.x} cy={dot.y} r={dot.isPeak ? "2.4" : "1.8"} />
              {dot.isPeak && <text className="peakLabel" x={Math.max(dot.x - 9, 2)} y={dot.y - 6}>Peak</text>}
            </g>
          ))}
        </svg>
      </div>
      <div className="xAxis">
        {labels.map((label) => <span key={label}>{label}</span>)}
      </div>
    </div>
  );
}

function Insight({ label, value, detail }) {
  return (
    <div className="insight">
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{detail}</em>
    </div>
  );
}

function DonutChart() {
  return (
    <div className="donut" aria-label="Users by role donut chart">
      <span>68%</span>
    </div>
  );
}

function Legend({ color, label, dashed = false }) {
  return <span><i className={dashed ? "dashedLegend" : ""} style={{ background: color }} /> {label}</span>;
}

function PageHeader({ title, subtitle, children }) {
  return (
    <header className="pageHeader">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </header>
  );
}

function Avatar({ name, role }) {
  return <div className={`avatar ${roleClass(role)}`}>{name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()}</div>;
}

function Badge({ type, children }) {
  return <span className={`badge ${type}`}>{children}</span>;
}

function Status({ loading, error }) {
  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="status error">Backend unavailable: {error}</p>;
  return null;
}

function filterUsers(users, filters) {
  return users.filter((user) => {
    const normalizedQuery = filters.query?.toLowerCase() || "";
    const matchesQuery = !normalizedQuery || user.name.toLowerCase().includes(normalizedQuery) || user.email.toLowerCase().includes(normalizedQuery);
    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status || (filters.status === "active" ? user.active : !user.active);
    const matchesLocation = !filters.location || user.location === filters.location;
    return matchesQuery && matchesRole && matchesStatus && matchesLocation;
  });
}

async function updateUserStatus(ids, active) {
  const endpoint = active ? "bulk-enable" : "bulk-disable";
  const response = await fetch(`${API_URL}/users/${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIds: ids })
  });
  if (!response.ok) throw new Error("Unable to update users");
}

function exportUsersCsv(filters) {
  const params = new URLSearchParams();
  if (filters.status) params.set("active", filters.status === "active");
  if (filters.location) params.set("location", filters.location);
  if (filters.role) params.set("role", filters.role);
  if (filters.query) params.set("q", filters.query);
  window.location.href = `${API_URL}/users/export${params.toString() ? `?${params}` : ""}`;
}

function normalizeTrend(values, currentValue) {
  if (values?.length >= 12) return values.slice(-12);
  if (values?.length) {
    const base = [1420, 1480, 1510, 1590, 1650, 1700, 1730, 1780, 1800, 1840, 1870, 1893];
    return [...base.slice(0, 12 - values.length), ...values];
  }
  return [1420, 1480, 1510, 1590, 1650, 1700, 1730, 1780, 1800, 1840, 1870, currentValue || 1893];
}

function buildChart(activeValues, disabledValues, labels) {
  const allValues = [...activeValues, ...disabledValues];
  const max = Math.ceil(Math.max(...allValues, 1) / 100) * 100;
  const min = Math.max(0, Math.floor(Math.min(...allValues) / 100) * 100 - 100);
  const range = Math.max(max - min, 1);
  const y = (value) => 92 - ((value - min) / range) * 78;
  const x = (index, count) => (index / Math.max(count - 1, 1)) * 100;
  const toPoints = (values) => values.map((value, index) => `${x(index, values.length)},${y(value)}`).join(" ");
  const peakIndex = indexOfMax(activeValues);

  return {
    activePoints: toPoints(activeValues),
    disabledPoints: toPoints(disabledValues),
    ticks: [max, Math.round((max + min) / 2), min],
    y,
    activeDots: activeValues.map((value, index) => ({
      label: labels[index],
      x: x(index, activeValues.length),
      y: y(value),
      isPeak: index === peakIndex
    }))
  };
}

function average(values) {
  return values.reduce((total, value) => total + value, 0) / Math.max(values.length, 1);
}

function indexOfMax(values) {
  return values.indexOf(Math.max(...values));
}

function indexOfMin(values) {
  return values.indexOf(Math.min(...values));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function roleClass(role) {
  if (role === "Admin") return "admin";
  if (role === "Manager") return "manager";
  return "user";
}

function joinedDate(id) {
  const dates = ["Jan 12, 2024", "Mar 3, 2024", "Feb 18, 2024", "Apr 5, 2024", "Nov 22, 2023", "May 1, 2024", "Jun 9, 2024", "Aug 11, 2024"];
  return dates[(id - 1) % dates.length];
}

function lastActive(id, active) {
  if (!active) return "2 months ago";
  const values = ["Today", "Yesterday", "Today", "12 days ago", "3 hours ago", "1 hour ago"];
  return values[(id - 1) % values.length];
}

createRoot(document.getElementById("root")).render(<App />);
