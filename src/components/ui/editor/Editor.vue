<template>
  <div class="w-full dark:bg-[#303030] relative">
    <div v-if="editor" class="flex items-center justify-between">
      <div>
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
      
      <el-tooltip content="Fullscreen" placement="top">
        <button
          type="button"
          class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          @click="toggleFullscreen"
        >
          <el-icon :size="20">
            <FullScreen v-if="!isFullscreen" />
            <Close v-else />
          </el-icon>
        </button>
      </el-tooltip>
    </div>

    <div :class="{ 'fullscreen-container': isFullscreen }">
      <div v-if="isFullscreen && editor" class="fullscreen-toolbar mb-4 flex items-center justify-between">
        <div>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="button.title"
            placement="top-start"
            v-for="(button, index) in buttons"
            :key="'fs-' + index"
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
        
        <el-tooltip content="Exit Fullscreen" placement="top">
          <button
            type="button"
            class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            @click="toggleFullscreen"
          >
            <el-icon :size="20">
              <Close />
            </el-icon>
          </button>
        </el-tooltip>
      </div>
      
      <editor-content :editor="editor" />
    </div>

    <!-- Lightbox Component -->
    <ImageLightbox v-model="lightboxVisible" :image-src="lightboxImage" />
  </div>
</template>

<script lang="ts" setup>
import Image from "@tiptap/extension-image";
import { EditorContent, Editor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import buttons from "./Buttons";
import { watch, onBeforeUnmount, ref } from "vue";
import { postMultipart, url } from "@/helpers/http";
import { FullScreen, Close } from "@element-plus/icons-vue";
import ImageLightbox from "@/components/ui/ImageLightbox.vue";

const props = defineProps<{
  modelValue: string | null;
}>();

const emit = defineEmits(["update:modelValue"]);

const editor = ref<Editor | undefined>();
const isFullscreen = ref(false);
const lightboxVisible = ref(false);
const lightboxImage = ref("");

// Custom Image extension with overlay icons
const CustomImage = Image.extend({
  addNodeView() {
    return ({ node }) => {
      const container = document.createElement("div");
      container.className = "image-container relative inline-block group";
      
      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.className = "max-w-full h-auto";
      
      const overlay = document.createElement("div");
      overlay.className = "image-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2";
      
      // View icon
      const viewBtn = document.createElement("button");
      viewBtn.className = "p-2 bg-white rounded-full hover:bg-gray-200 transition-colors shadow-lg cursor-pointer";
      viewBtn.innerHTML = '<svg class="w-5 h-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"/></svg>';
      viewBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        lightboxImage.value = node.attrs.src;
        lightboxVisible.value = true;
      };
      
      // Download icon
      const downloadBtn = document.createElement("button");
      downloadBtn.className = "p-2 bg-white rounded-full hover:bg-gray-200 transition-colors shadow-lg cursor-pointer";
      downloadBtn.innerHTML = '<svg class="w-5 h-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64zm384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64v450.304z"/></svg>';
      downloadBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const link = document.createElement("a");
        link.href = node.attrs.src;
        link.download = node.attrs.alt || "image";
        link.target = "_blank";
        link.click();
      };
      
      overlay.appendChild(viewBtn);
      overlay.appendChild(downloadBtn);
      
      container.appendChild(img);
      container.appendChild(overlay);
      
      return {
        dom: container,
      };
    };
  },
});

editor.value = new Editor({
  extensions: [
    StarterKit,
    CustomImage.configure({ inline: false, allowBase64: true }),
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

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

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

.fullscreen-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9000;
  background: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.dark .fullscreen-container {
  background: #1e1e1e;
}

.fullscreen-container .ProseMirror {
  height: 100%;
  flex: 1;
}

.fullscreen-toolbar {
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.dark .fullscreen-toolbar {
  border-bottom-color: #555;
}

.image-container {
  margin: 10px 0;
}

.image-overlay {
  cursor: pointer;
}
</style>