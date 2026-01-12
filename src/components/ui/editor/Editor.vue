<template>
  <div class="w-full dark:bg-[#303030]">
    <div v-if="editor">
      <el-tooltip
        class="box-item"
        effect="dark"
        :content="button.title"
        placement="top-start"
        v-for="(button, index) in buttons"
        :key="index"
      >
        <button
          type="button"
          class="mr-2"
          @click="editor.chain().focus()[button.action]().run()"
          :class="{ 'is-active': editor.isActive(button.title) }"
        >
          <span v-html="button.icon"></span>
        </button>
      </el-tooltip>
    </div>

    <editor-content :editor="editor" />
  </div>
</template>

<script lang="ts" setup>
import Image from "@tiptap/extension-image";
import { EditorContent, Editor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import buttons from "./Buttons";
import { watch, onBeforeUnmount, ref } from "vue";
import { postMultipart, url } from "@/helpers/http";

const props = defineProps<{
  modelValue: string | null;
}>();

const emit = defineEmits(["update:modelValue"]);

const editor = ref<Editor | null>(null);

editor.value = new Editor({
  extensions: [
    StarterKit,
    Image.configure({ inline: false, allowBase64: true }),
  ],
  editorProps: {
    handlePaste(view, event) {
      const items = event.clipboardData?.items;
      if (!items) return false;

      for (const item of items) {
        if (!item.type.startsWith("image/")) continue;

        const file = item.getAsFile();
        if (!file || !editor.value) continue;

        // Insert temporary placeholder
        editor.value
          .chain()
          .focus()
          .setImage({ src: "/spinner.svg", alt: "Uploading..." })
          .run();

        const form = new FormData();
        form.append("file", file);

        // Upload using your API wrapper
        postMultipart(url("files"), form)
          .then((uploaded) => {
            if (!editor.value) return;

            // Replace placeholder with actual uploaded URL
            editor.value
              .chain()
              .focus()
              .command(({ tr, state }) => {
                state.doc.descendants((node, pos) => {
                  if (
                    node.type.name === "image" &&
                    node.attrs.src === "/spinner.svg"
                  ) {
                    tr.setNodeMarkup(pos, undefined, {
                      ...node.attrs,
                      src: uploaded.url,
                      alt: file.name,
                    });
                  }
                });
                return true;
              })
              .run();
          })
          .catch((err) => {
            console.error("Image upload failed", err);
            // Remove the placeholder on error
            if (editor.value) {
              editor.value
                .chain()
                .focus()
                .command(({ tr, state }) => {
                  state.doc.descendants((node, pos) => {
                    if (
                      node.type.name === "image" &&
                      node.attrs.src === "/spinner.svg"
                    ) {
                      tr.delete(pos, pos + node.nodeSize);
                    }
                  });
                  return true;
                })
                .run();
            }
          });

        return true; // stop after first image
      }

      return false;
    },
  },
  content: props.modelValue ?? "",
  onUpdate: () => {
    if (editor.value) {
      emit("update:modelValue", editor.value.getHTML());
    }
  },
});

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value ?? "");
    }
  },
);

// Cleanup on unmount
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
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
  height: 200px;
  overflow-y: auto;
}

.dark .ProseMirror {
  background: #1e1e1e;
  color: #e0e0e0;
  border-color: #555;
}
</style>
