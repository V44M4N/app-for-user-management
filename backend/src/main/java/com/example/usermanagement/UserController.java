package com.example.usermanagement;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> users(
            @RequestParam Optional<Boolean> active,
            @RequestParam Optional<String> location,
            @RequestParam Optional<String> role,
            @RequestParam Optional<String> q) {
        return userService.getUsers(active, location, role, q);
    }

    @GetMapping("/users/locations")
    public List<String> locations() {
        return userService.getLocations();
    }

    @GetMapping("/users/roles")
    public List<String> roles() {
        return userService.getRoles();
    }

    @GetMapping(value = "/users/export", produces = "text/csv")
    public ResponseEntity<String> exportUsers(
            @RequestParam Optional<Boolean> active,
            @RequestParam Optional<String> location,
            @RequestParam Optional<String> role,
            @RequestParam Optional<String> q) {
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"users.csv\"")
                .body(userService.exportUsersCsv(active, location, role, q));
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return userService.getDashboard();
    }

    @PatchMapping("/users/{id}/disable")
    public User disableUser(@PathVariable Long id) {
        return userService.setActive(id, false);
    }

    @PatchMapping("/users/{id}/enable")
    public User enableUser(@PathVariable Long id) {
        return userService.setActive(id, true);
    }

    @PatchMapping("/users/bulk-disable")
    public List<User> disableUsers(@RequestBody BulkUserStatusRequest request) {
        return userService.setActiveBulk(request.userIds(), false);
    }

    @PatchMapping("/users/bulk-enable")
    public List<User> enableUsers(@RequestBody BulkUserStatusRequest request) {
        return userService.setActiveBulk(request.userIds(), true);
    }

    @GetMapping("/audit-logs")
    public List<AuditLog> auditLogs() {
        return userService.getAuditLogs();
    }
}
