<template>
   
</template>

<script lang="ts" setup>
    import Avatar from './Avatar.vue'

    defineProps<{
        user: User,
        showDeleteBtn?: boolean
    }>()
</script>