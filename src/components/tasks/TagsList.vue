<template>
  <tag
    v-for="tag in tags"
    :background-color="tag.background_color"
    :color="tag.color"
    :text="tag.name"
    :closable="true"
    @close="emit('remove', tag.id)"
  />
</template>

<script lang="ts" setup>

import Tag from '../ui/Tag.vue'

defineProps<{
  tags: Tag[]
}>()

const emit = defineEmits(['remove'])

</script>
