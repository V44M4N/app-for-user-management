package com.example.usermanagement;

import java.util.List;

public record BulkUserStatusRequest(List<Long> userIds) {
}
