package com.example.usermanagement;

import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final List<User> users = new CopyOnWriteArrayList<>(
            List.of(
                    new User(1L, "Aarav Mehta", "aarav@example.com", "Admin", "Mumbai", "Jan 12, 2024", "Today", true),
                    new User(2L, "Priya Nair", "priya@example.com", "Manager", "Bengaluru", "Mar 3, 2024", "Yesterday", true),
                    new User(3L, "Rohan Shah", "rohan@example.com", "User", "Delhi", "Feb 18, 2024", "2 months ago", false),
                    new User(4L, "Neha Rao", "neha@example.com", "User", "Hyderabad", "Apr 5, 2024", "Today", true),
                    new User(5L, "Kabir Khan", "kabir@example.com", "Manager", "Pune", "Nov 22, 2023", "3 hours ago", true),
                    new User(6L, "Anika Singh", "anika@example.com", "User", "Chennai", "May 1, 2024", "45 days ago", false),
                    new User(7L, "Dev Patel", "dev@example.com", "User", "Mumbai", "Jun 9, 2024", "Today", true),
                    new User(8L, "Mira Das", "mira@example.com", "Admin", "Kolkata", "Aug 11, 2024", "1 hour ago", true)));
    private final List<AuditLog> auditLogs = new CopyOnWriteArrayList<>(
            List.of(
                    new AuditLog(3L, "Rohan Shah", "DISABLED", "Super Admin", Instant.now().minusSeconds(86_400)),
                    new AuditLog(6L, "Anika Singh", "DISABLED", "Super Admin", Instant.now().minusSeconds(172_800))));

    public List<User> getUsers(
            Optional<Boolean> active,
            Optional<String> location,
            Optional<String> role,
            Optional<String> q) {
        return users.stream()
                .filter(user -> active.map(value -> user.isActive() == value).orElse(true))
                .filter(user -> location
                        .map(value -> user.getLocation().equalsIgnoreCase(value))
                        .orElse(true))
                .filter(user -> role
                        .map(value -> user.getRole().equalsIgnoreCase(value))
                        .orElse(true))
                .filter(user -> q
                        .map(value -> matchesQuery(user, value))
                        .orElse(true))
                .sorted(Comparator.comparing(User::getId))
                .toList();
    }

    public List<String> getLocations() {
        return users.stream()
                .map(User::getLocation)
                .distinct()
                .sorted()
                .toList();
    }

    public List<String> getRoles() {
        return users.stream()
                .map(User::getRole)
                .distinct()
                .sorted()
                .toList();
    }

    public List<Integer> getActiveTrend() {
        return List.of(1420, 1480, 1510, 1590, 1650, 1700, 1730, 1780, 1800, 1840, 1870, 1893);
    }

    public List<Integer> getDisabledTrend() {
        return List.of(80, 88, 92, 98, 106, 112, 118, 126, 132, 138, 144, 148);
    }

    public Map<String, Long> getRoleDistribution() {
        return users.stream()
                .collect(Collectors.groupingBy(User::getRole, LinkedHashMap::new, Collectors.counting()));
    }

    public Map<String, Long> getRegistrationsByLocation() {
        return users.stream()
                .collect(Collectors.groupingBy(User::getLocation, LinkedHashMap::new, Collectors.counting()));
    }

    public Map<String, Object> getDashboard() {
        return Map.of(
                "totalUsers", users.size(),
                "activeUsers", activeCount(),
                "disabledUsers", disabledCount(),
                "newToday", 3,
                "activeTrend", getActiveTrend(),
                "disabledTrend", getDisabledTrend(),
                "roleDistribution", getRoleDistribution(),
                "registrationsByLocation", getRegistrationsByLocation(),
                "recentActivity", getAuditLogs());
    }

    public User setActive(Long id, boolean active) {
        User user = users.stream()
                .filter(candidate -> candidate.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new UserNotFoundException(id));
        user.setActive(active);
        auditLogs.add(0, new AuditLog(
                user.getId(),
                user.getName(),
                active ? "ENABLED" : "DISABLED",
                "Super Admin",
                Instant.now()));
        return user;
    }

    public List<User> setActiveBulk(List<Long> userIds, boolean active) {
        return userIds.stream()
                .map(id -> setActive(id, active))
                .toList();
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogs.stream().limit(10).toList();
    }

    public String exportUsersCsv(Optional<Boolean> active, Optional<String> location, Optional<String> role, Optional<String> q) {
        List<User> filteredUsers = getUsers(active, location, role, q);
        StringBuilder csv = new StringBuilder("id,name,email,role,location,joined,lastActive,status\n");
        filteredUsers.forEach(user -> csv.append(user.getId()).append(",")
                .append(csvCell(user.getName())).append(",")
                .append(csvCell(user.getEmail())).append(",")
                .append(csvCell(user.getRole())).append(",")
                .append(csvCell(user.getLocation())).append(",")
                .append(csvCell(user.getJoined())).append(",")
                .append(csvCell(user.getLastActive())).append(",")
                .append(user.isActive() ? "Active" : "Disabled")
                .append("\n"));
        return csv.toString();
    }

    public int activeCount() {
        return (int) users.stream().filter(User::isActive).count();
    }

    public int disabledCount() {
        return (int) users.stream().filter(user -> !user.isActive()).count();
    }

    private boolean matchesQuery(User user, String query) {
        String normalizedQuery = query.toLowerCase();
        return user.getName().toLowerCase().contains(normalizedQuery)
                || user.getEmail().toLowerCase().contains(normalizedQuery);
    }

    private String csvCell(String value) {
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}
