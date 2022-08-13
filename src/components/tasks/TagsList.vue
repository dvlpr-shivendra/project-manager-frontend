<template>

  <div class="my-6">
    <tag v-for="tag in tags" :background-color="tag.background_color" :color="tag.color" :text="tag.name"
      :closable="true" @close="emit('remove', tag.id)" />

    <tag background-color="#ccc" v-if="!showInput" color="#000" text="+ tag" @click="showInput = true" />

    <tag-form v-else :available-tags="tagList" @add-new-tag="saveTagAndAdd" @add-tag="addTag" />  </div>

</template>

<script lang="ts" setup>

import { ref } from 'vue';
import Tag from '@/components/ui/Tag.vue';
import TagForm from '@/components/ui/TagForm.vue';
import { useTags } from '@/stores/tags';
import { post, url } from '@/helpers/http';

const { list: tagList } = useTags()

const props = defineProps<{
  tags: Tag[]
}>()

const showInput = ref<boolean>(false)

const emit = defineEmits(['remove', 'add'])

async function saveTagAndAdd(newTag: NewTag) {
  post(url('tags'), newTag)
    .then((tag: Tag) => addTag(tag))
    .catch(e => console.log(e))
}

function addTag(tag:Tag) {
  emit('add', tag)
  showInput.value = false
}

</script>
