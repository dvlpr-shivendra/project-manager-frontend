<script setup lang="ts">
import { ref, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { get, post, url } from "@/helpers/http"

const users = ref<User[]>([])
const roles = ref<Role[]>([])
const permissions = ref<Permission[]>([])

const newRole = ref("")
const newPermission = ref("")

const load = async () => {
  users.value = await get(url("users"))
  roles.value = await get(url("roles"))
  permissions.value = await get(url("permissions"))

  roles.value.forEach(role => {
    role.permissionNames = role.permissions.map(p => p.name)
  })
}

const createRole = async () => {
  if (!newRole.value.trim()) return
  await post(url("roles"), { name: newRole.value })
  newRole.value = ""
  load()
}

const createPermission = async () => {
  if (!newPermission.value.trim()) return
  await post(url("permissions"), { name: newPermission.value })
  newPermission.value = ""
  load()
}

const updateRolePermissions = async (role: Role) => {
  await post(url(`roles/${role.id}/permissions`), {
    permissions: role.permissionNames,
  })
  ElMessage.success("Role updated")
}

const updateUserRoles = async (user: User) => {
  await post(url(`users/${user.id}/roles`), {
    roles: user.roles.map(r => r.name),
  })
  ElMessage.success("User updated")
}

onMounted(load)
</script>

<template>
  <el-card>
    <h3>Create Role</h3>
    <el-input v-model="newRole" placeholder="Role name" />
    <el-button class="mt-2" @click="createRole">Add Role</el-button>

    <h3 class="mt-4">Create Permission</h3>
    <el-input v-model="newPermission" placeholder="Permission name" />
    <el-button class="mt-2" @click="createPermission">Add Permission</el-button>
  </el-card>

  <el-card
    v-for="role in roles"
    :key="role.id"
    class="mt-4"
  >
    <h3>{{ role.name }}</h3>

    <el-checkbox-group
      v-model="role.permissionNames"
      @change="() => updateRolePermissions(role)"
    >
      <el-checkbox
        v-for="p in permissions"
        :key="p.id"
        :label="p.name"
      >
        {{ p.name }}
      </el-checkbox>
    </el-checkbox-group>
  </el-card>

  <el-card class="mt-4">
    <h3>Users</h3>

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
  </el-card>
</template>
