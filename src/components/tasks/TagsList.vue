<template>
  <tag
    v-for="tag in tags"
    :background-color="tag.background_color"
    :color="tag.color"
    :text="tag.name"
    :closable="true"
    @close="emit('remove', tag.id)"
  />

  <tag background-color="#ccc"
    v-if="!showInput"
    color="#000"
    text="+ tag"
    @click="showInput = true"
  />

  <tag-form :available-tags="tagList" />

</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import Tag from '@/components/ui/Tag.vue';
import TagForm from '@/components/ui/TagForm.vue';
import { useTags } from '@/stores/tags';

const { list: tagList } = useTags()

defineProps<{
  tags: Tag[]
}>()

const newTag = ref<string>('')
const showInput = ref<boolean>(false)

const emit = defineEmits(['remove', 'add'])

function addTag() {
  if (newTag.value) {
    emit('add', newTag.value)
    newTag.value = ''
  }
}

</script>
