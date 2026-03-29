import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useMeStore } from "../me";

describe("Me Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should initialize with user from auth helper", () => {
    const store = useMeStore();
    // Assuming getUser returns something from localStorage or null
    // Here we can mock getUser if we want, but let's check initial state
    expect(store.user).toBeDefined();
  });

  it("should update user when setUser is called", () => {
    const store = useMeStore();
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      roles: [],
      stats: {
        projects_count: 5,
        open_tasks_count: 10,
        completed_tasks_count: 20,
        overdue_tasks_count: 2,
      },
    };

    store.setUser(mockUser);
    expect(store.user).toEqual(mockUser);
  });
});
