import { useMeStore } from "@/stores/me";

export function useCan() {
  const meStore = useMeStore();

  return {
    can: (permission: string) => meStore.can(permission),
    hasRole: (roleName: string) => meStore.hasRole(roleName),
  };
}
