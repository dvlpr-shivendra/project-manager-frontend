import { describe, it, expect, vi } from "vitest";
import { fetchMe } from "../meService";

vi.mock("@/helpers/http", () => ({
  get: vi.fn(),
  url: vi.fn((path) => `http://api.test/${path}`),
}));

import { get } from "@/helpers/http";

describe("Me Service", () => {
  it("should fetch current user data", async () => {
    const mockUser: User = { 
        id: 1, 
        name: "Test User", 
        email: "test@example.com", 
        roles: [],
        stats: {
            projects_count: 5,
            open_tasks_count: 10,
            completed_tasks_count: 15,
            overdue_tasks_count: 0
        }
    };
    (get as any).mockResolvedValue(mockUser);

    const result = await fetchMe();

    expect(get).toHaveBeenCalledWith("http://api.test/me");
    expect(result).toEqual(mockUser);
  });
});
