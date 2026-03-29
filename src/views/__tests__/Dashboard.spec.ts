import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import Dashboard from "../Dashboard.vue";
import { useMeStore } from "@/stores/me";

// Mock router-link
const RouterLinkStub = {
  template: '<a><slot /></a>',
  props: ['to']
};

describe("Dashboard.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders welcome message with user first name", () => {
    const meStore = useMeStore();
    meStore.setUser({
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
    });

    const wrapper = mount(Dashboard, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    });
    
    expect(wrapper.text()).toContain("Good");
    expect(wrapper.text()).toContain("John");
  });

  it("renders statistics correctly from store", () => {
    const meStore = useMeStore();
    meStore.setUser({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      roles: [],
      stats: {
        projects_count: 12,
        open_tasks_count: 8,
        completed_tasks_count: 15,
        overdue_tasks_count: 3,
      },
    });

    const wrapper = mount(Dashboard, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    });

    expect(wrapper.text()).toContain("12");
    expect(wrapper.text()).toContain("8");
    expect(wrapper.text()).toContain("15");
    expect(wrapper.text()).toContain("3");
  });
});
