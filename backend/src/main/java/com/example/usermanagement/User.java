package com.example.usermanagement;

public class User {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String location;
    private String joined;
    private String lastActive;
    private boolean active;

    public User(
            Long id,
            String name,
            String email,
            String role,
            String location,
            String joined,
            String lastActive,
            boolean active) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.location = location;
        this.joined = joined;
        this.lastActive = lastActive;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getLocation() {
        return location;
    }

    public String getJoined() {
        return joined;
    }

    public String getLastActive() {
        return lastActive;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
