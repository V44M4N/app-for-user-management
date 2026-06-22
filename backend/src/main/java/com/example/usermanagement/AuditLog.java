package com.example.usermanagement;

import java.time.Instant;

public record AuditLog(Long userId, String userName, String action, String actor, Instant createdAt) {
}
