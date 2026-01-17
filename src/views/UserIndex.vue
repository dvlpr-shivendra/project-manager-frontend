<template>
  <div>
    <pimped-heading>Users and Roles Management</pimped-heading>

    <section>
      <pimped-subheading>Roles</pimped-subheading>
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <pimped-card class="mb-4">
          <pimped-section-heading>Create Role</pimped-section-heading>
          <el-input
            class="max-w-xl"
            v-model="newRole"
            placeholder="Role name"
          />
          <el-button class="ml-2" @click="createRole">Add Role</el-button>
        </pimped-card>
      </div>
    </section>

    <section>
      <pimped-subheading>Permissions</pimped-subheading>
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <pimped-card v-for="role in roles" :key="role.id">
          <pimped-section-heading>{{ role.name }}</pimped-section-heading>
          <el-checkbox-group
            v-model="role.permissionNames"
            @change="() => updateRolePermissions(role)"
          >
            <div class="grid grid-cols-2 gap-4">
              <el-checkbox
                class="mr-0!"
                v-for="p in permissions"
                :key="p.id"
                :value="p.name"
                border
              >
                {{ p.name }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </pimped-card>
      </div>
    </section>

    <section>
      <pimped-subheading>Users</pimped-subheading>
      <pimped-card>
        <el-table :data="users" style="width: 100%">
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="email" label="Email" />
          <el-table-column label="Roles">
            <template #default="{ row }">
              <el-select
                v-model="row.roles"
                multiple
                value-key="name"
                @change="() => updateUserRoles(row)"
              >
                <el-option
                  v-for="role in roles"
                  :key="role.id"
                  :label="role.name"
                  :value="role"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </pimped-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { get, post, url } from "@/helpers/http";
import PimpedHeading from "@/components/ui/PimpedHeading.vue";
import PimpedCard from "@/components/ui/PimpedCard.vue";
import PimpedSubheading from "@/components/ui/PimpedSubheading.vue";
import PimpedSectionHeading from "@/components/ui/PimpedSectionHeading.vue";

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const permissions = ref<Permission[]>([]);

const newRole = ref("");

const load = async () => {
  users.value = await get(url("users"));
  roles.value = await get(url("roles"));
  permissions.value = await get(url("permissions"));

  roles.value.forEach((role) => {
    role.permissionNames = role.permissions.map((p) => p.name);
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
  ElMessage.success("Role updated");
};

const updateUserRoles = async (user: User) => {
  await post(url(`users/${user.id}/roles`), {
    roles: user.roles.map((r) => r.name),
  });
  ElMessage.success("User updated");
};

onMounted(load);
</script>
