<template>
    <el-card class="col-span-12 md:col-span-6 lg:col-span-4">
        <template #header>
            <div class="flex justify-end">
                <el-dropdown class="mr-2">
                    <el-button :text="true">
                        <MoreFilled class="text-black w-4 h-4" />
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>Delete</el-dropdown-item>
                            <el-dropdown-item>Update</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </template>

        <el-skeleton animated>
            <template #template>
                <el-skeleton-item variant="h3" style="width: 70%" />

                <el-skeleton-item variant="text" style="margin-right: 16px" />
                <el-skeleton-item variant="text" style="width: 30%" />
            </template>
        </el-skeleton>
    </el-card>
</template>

<script lang="ts" setup>
import { MoreFilled } from '@element-plus/icons-vue'
</script>