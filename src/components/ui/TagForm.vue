<template>
  <span>
    <el-select
      filterable
      allow-create
      default-first-option
      :reserve-keyword="false"
      placeholder="Choose tags"
      @change="handleChange"
    >
      <el-option v-for="item in availableTags" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>

    <el-drawer v-model="isNewTag" title="I am the title" :with-header="false">
      <div class="flex items-center mb-4">
        <span class="mr-4">Tag text color</span>
        <el-color-picker v-model="color" size="large" />
      </div>
      <div class="flex items-center mb-4">
        <span class="mr-4">Tag background color</span>
        <el-color-picker v-model="backgroundColor" size="large" />
      </div>

      <el-button type="primary" @click="addNewTag">Add tag</el-button>
    </el-drawer>
  </span>
</template>


<script lang="ts" setup>

import { defineProps, ref } from "vue";

const props = defineProps<{
  availableTags: Tag[]
}>()

const emit = defineEmits(['addNewTag', 'addTag'])

const isNewTag = ref<boolean>(false)
const backgroundColor = ref<string>('#ccc')
const color = ref<string>('#000')
const newTagName = ref<string>('')

function handleChange(input: number | string) {
  if (typeof input === 'number') {
    const tag = props.availableTags[input - 1]

    emit('addTag', tag)
  } else {
    isNewTag.value = true
    newTagName.value = input
  }
}

function addNewTag() {
  emit('addNewTag', {
    name: newTagName.value,
    color,
    backgroundColor
  })

  newTagName.value = ''
  isNewTag.value = false
}

</script>