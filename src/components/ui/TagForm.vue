<template>
  <span>
    <el-select
    :key="`tag-${availableTags.length}`"
      filterable
      allow-create
      default-first-option
      :reserve-keyword="false"
      no-data-text="Enter the tag name and press enter"
      placeholder="Choose tags"
      @change="handleChange"
    >
      <el-option
        v-for="item in availableTags"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>

    <TagFormDialog
      v-model="dialogVisible"
      :tag="prefillTag"
      @saved="onSaved"
    />
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TagFormDialog from '@/components/TagFormDialog.vue';

const props = defineProps<{
  availableTags: Tag[];
}>();

const emit = defineEmits(['addTag']);

const dialogVisible = ref(false);
const prefillTag = ref<Tag | null>(null);

function handleChange(input: number | string) {
  if (typeof input === 'number') {
    const tag = props.availableTags.find(t => t.id === input);
    if (tag) emit('addTag', tag);
  } else {
    prefillTag.value = {
      name: input,
      color: '#000000',
      background_color: '#FFFFFF',
    } as Tag;

    dialogVisible.value = true;
  }
}

const onSaved = (tag: Tag) => {
  emit('addTag', tag);
  dialogVisible.value = false;
};
</script>
