<template>
    <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
            {{ label }}
            <el-icon class="el-icon--right">
                <ArrowDown />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item :command="-1">
                    Clear
                </el-dropdown-item>
                <el-dropdown-item v-for="option of options" :command="option.id" :key="option.id">
                    {{ option.name }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>


<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'

type Option = {
    id: number,
    name: string,
}

defineProps<{
    label: string,
    options: Option[]
}>()

const emit = defineEmits(['change', 'clear'])

function handleCommand(id: number) {
    if (id === -1) {
        emit('clear')
    } else {
        emit('change', id)
    }
}

</script>
