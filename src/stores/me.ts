import { defineStore } from "pinia";
import { ref } from "vue";
import { getUser } from "@/helpers/auth";

export const useMeStore = defineStore("me", () => {
  const user = ref<User | null>(getUser());

  function setUser(userData: User) {
    user.value = userData;
  }

  return {
    user,
    setUser,
  };
});
