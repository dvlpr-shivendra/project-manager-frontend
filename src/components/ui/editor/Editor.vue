<template>
  <div>
    <div v-if="editor">
      <el-tooltip class="box-item" effect="dark" :content="button.title" placement="top-start"
        v-for="button in buttons">
        <button type="button" class="mr-2" @click="editor.chain().focus()[button.action]().run()"
          :class="{ 'is-active': editor.isActive(button.title) }">
          <span v-html="button.icon"></span>
        </button>
      </el-tooltip>
    </div>

    <editor-content :editor="editor" />
  </div>
</template>

<script lang="ts" setup>
import { EditorContent, Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import buttons from './Buttons'
import { watch } from 'vue';

const props = defineProps<{
  modelValue: string|null
}>()

const emit = defineEmits(['update:modelValue'])

const editor: Editor = new Editor({
  extensions: [
    StarterKit,
  ],
  content: props.modelValue,
  onUpdate: () => emit('update:modelValue', editor.getHTML()),
})

watch(() => props.modelValue, (value) => {
  if (editor.getHTML() !== value) {
    editor.commands.setContent(value)
  }
})
</script>


<style>
.ProseMirror {
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px;
  box-sizing: border-box;
  max-height: 85px;
  overflow-y: scroll;
}
</style>