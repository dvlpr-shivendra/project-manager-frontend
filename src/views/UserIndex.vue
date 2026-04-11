<template>
  <div class="flex flex-col gap-8">
    <pimped-heading>Users & Roles</pimped-heading>
    <section class="flex flex-col gap-4">
      <h2 class="font-['Syne'] font-bold text-lg text-gray-900 dark:text-white">
        Roles
      </h2>
      <div
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm"
      >
        <p
          class="text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-3"
        >
          Create new role
        </p>
        <div class="flex items-center gap-3 max-w-sm">
          <el-input
            v-model="newRole"
            placeholder="e.g. Editor, Viewer"
            @keyup.enter="createRole"
          />
          <button
            @click="createRole"
            class="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Add Role
          </button>
        </div>
      </div>
      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="role in roles"
          :key="role.id"
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm flex flex-col gap-3"
        >
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
            <p
              class="font-['Syne'] font-bold text-[14px] text-gray-900 dark:text-white"
            >
              {{ role.name }}
            </p>
          </div>
          <el-checkbox-group
            v-model="role.permissionNames"
            @change="() => updateRolePermissions(role)"
          >
            <div class="grid grid-cols-2 gap-2">
              <el-checkbox
                v-for="p in permissions"
                :key="p.id"
                :value="p.name"
                border
                class="!mr-0 !w-full text-[12px]"
                >{{ p.name }}</el-checkbox
              >
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </section>
    <section class="flex flex-col gap-4">
      <h2 class="font-['Syne'] font-bold text-lg text-gray-900 dark:text-white">
        Users
      </h2>
      <div
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm"
      >
        <el-table :data="users" style="width: 100%">
          <el-table-column label="User" min-width="200">
            <template #default="{ row }">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold font-['Syne'] shrink-0"
                >
                  {{
                    row.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  }}
                </div>
                <div>
                  <p
                    class="text-[13px] font-semibold text-gray-900 dark:text-white leading-tight"
                  >
                    {{ row.name }}
                  </p>
                  <p class="text-[11px] text-gray-400 dark:text-gray-500">
                    {{ row.email }}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="Email" min-width="200"
            ><template #default="{ row }"
              ><span class="text-[13px] text-gray-500 dark:text-gray-400">{{
                row.email
              }}</span></template
            ></el-table-column
          >
          <el-table-column label="Roles" min-width="240">
            <template #default="{ row }"
              ><el-select
                v-model="row.roles"
                multiple
                value-key="name"
                placeholder="Assign roles"
                @change="() => updateUserRoles(row)"
                style="width: 100%"
                ><el-option
                  v-for="role in roles"
                  :key="role.id"
                  :label="role.name"
                  :value="role" /></el-select
            ></template>
          </el-table-column>
        </el-table>
        <div
          v-if="users.length === 0"
          class="flex flex-col items-center gap-3 py-16 text-gray-400 dark:text-gray-600"
        >
          <p class="text-[14px] font-medium text-gray-500 dark:text-gray-500">
            No users found
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { get, post, url } from "@/helpers/http";
import PimpedHeading from "@/components/ui/PimpedHeading.vue";
import { useMeStore } from "@/stores/me";
const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const permissions = ref<Permission[]>([]);
const newRole = ref("");
const meStore = useMeStore();
const router = useRouter();

const load = async () => {
  if (!meStore.hasRole("admin")) {
    router.push("/");
    return;
  }
  users.value = await get(url("users"));
  roles.value = await get(url("roles"));
  permissions.value = await get(url("permissions"));
  roles.value.forEach((role) => {
    role.permissionNames = role.permissions.map((p: any) => p.name);
  });
};
const createRole = async () => {
  if (!newRole.value.trim()) return;
  await post(url("roles"), { name: newRole.value });
  newRole.value = "";
  load();
};
const updateRolePermissions = async (role: Role) => {
  await post(url(`roles/${role.id}/permissions`), {
    permissions: role.permissionNames,
  });
  await meStore.fetchData();
  ElMessage.success("Role updated");
};
const updateUserRoles = async (user: User) => {
  await post(url(`users/${user.id}/roles`), {
    roles: user.roles.map((r: any) => r.name),
  });
  ElMessage.success("User updated");
  await meStore.fetchData();
};

onMounted(async () => {
  // Wait for user data to be loaded if not already
  if (!meStore.user) {
    const checkUser = watch(
      () => meStore.user,
      (user) => {
        if (user) {
          checkUser();
          load();
        }
      },
    );
  } else {
    load();
  }
});
</script>
