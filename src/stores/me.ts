import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getUser } from "@/helpers/auth";

export const useMeStore = defineStore("me", () => {
  const user = ref<User | null>(getUser());

  const permissions = computed(() => {
    const u = user.value;
    if (!u) return [];
    if (u.permissions && Array.isArray(u.permissions)) return u.permissions;
    if (u.roles && Array.isArray(u.roles)) {
      return u.roles.flatMap((role) => role.permissionNames || []);
    }
    return [];
  });

  function can(permission: string) {
    return permissions.value.includes(permission);
  }

  function hasRole(roleName: string) {
    const u = user.value;
    if (!u || !u.roles || !Array.isArray(u.roles)) return false;
    return u.roles.some((role) => role && role.name === roleName);
  }

  function setUser(userData: User) {
    user.value = userData;
  }

  async function fetchData() {
    try {
      const { fetchMe } = await import("@/services/meService");
      const data = await fetchMe();
      setUser(data);
      return data;
    } catch (e) {
      console.error("Failed to fetch user data:", e);
      throw e;
    }
  }

  return {
    user,
    can,
    hasRole,
    setUser,
    fetchData: fetchData,
  };
});
