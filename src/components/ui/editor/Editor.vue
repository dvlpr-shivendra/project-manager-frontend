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

        <el-dropdown @command="handleCommand">
          <button type="button" class="cursor-pointer" :disabled="isRephrasing">
            <el-icon :size="24">
              <MagicStick />
            </el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="rephrase">
                <el-icon class="mr-2"><Refresh /></el-icon>
                Rephrase
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="flex items-center gap-2">
        

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
    </div>

    <div :class="{ 'fullscreen-container': isFullscreen }">
      <div
        v-if="isFullscreen && editor"
        class="fullscreen-toolbar mb-4 flex items-center justify-between"
      >
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
      </div>

      <div class="editor-wrapper">
        <editor-content :editor="editor" />

        <!-- Skeleton Overlay -->
        <div v-if="isRephrasing" class="skeleton-overlay">
          <el-skeleton :rows="3" animated />
        </div>
      </div>
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
import { post, postMultipart, url } from "@/helpers/http";
import {
  FullScreen,
  Close,
  Refresh,
  MagicStick,
} from "@element-plus/icons-vue";
import ImageLightbox from "@/components/ui/ImageLightbox.vue";
import { ElMessage } from "element-plus";

const props = defineProps<{
  modelValue: string | null;
}>();

const emit = defineEmits(["update:modelValue"]);

const editor = ref<Editor | undefined>();
const isFullscreen = ref(false);
const lightboxVisible = ref(false);
const lightboxImage = ref("");
const isRephrasing = ref(false);

// Custom Image extension with overlay icons and resize
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      height: {
        default: 100,
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
          };
        },
      },
      width: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return {
            width: attributes.width,
          };
        },
      },
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const container = document.createElement("div");
      container.className = "image-container relative inline-block group";
      container.setAttribute("data-drag-handle", "");

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.style.height = `${node.attrs.height}px`;
      if (node.attrs.width) {
        img.style.width = `${node.attrs.width}px`;
      } else {
        img.style.width = "auto";
      }
      img.className = "block";

      const overlay = document.createElement("div");
      overlay.className =
        "image-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2";

      // View icon
      const viewBtn = document.createElement("button");
      viewBtn.className =
        "p-2 bg-white rounded-full hover:bg-gray-200 transition-colors shadow-lg cursor-pointer";
      viewBtn.innerHTML =
        '<svg class="w-5 h-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"/></svg>';
      viewBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        lightboxImage.value = node.attrs.src;
        lightboxVisible.value = true;
      };

      // Download icon
      const downloadBtn = document.createElement("button");
      downloadBtn.className =
        "p-2 bg-white rounded-full hover:bg-gray-200 transition-colors shadow-lg cursor-pointer";
      downloadBtn.innerHTML =
        '<svg class="w-5 h-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64zm384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64v450.304z"/></svg>';
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

      // Resize handle
      const resizeHandle = document.createElement("div");
      resizeHandle.className =
        "resize-handle absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity";

      let isResizing = false;
      let startX = 0;
      let startY = 0;
      let startHeight = 0;
      let aspectRatio = 1;

      resizeHandle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startHeight = node.attrs.height || 100;

        // Calculate aspect ratio
        const imgElement = img as HTMLImageElement;
        if (imgElement.naturalWidth && imgElement.naturalHeight) {
          aspectRatio = imgElement.naturalWidth / imgElement.naturalHeight;
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      });

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const deltaY = e.clientY - startY;
        const newHeight = Math.max(100, startHeight + deltaY);
        const newWidth = newHeight * aspectRatio;

        img.style.height = `${newHeight}px`;
        img.style.width = `${newWidth}px`;
      };

      const handleMouseUp = () => {
        if (!isResizing) return;
        isResizing = false;

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        // Update the node attributes
        const height = parseInt(img.style.height);
        const width = parseInt(img.style.width);

        if (typeof getPos === "function") {
          editor.view.dispatch(
            editor.view.state.tr.setNodeMarkup(getPos() || 0, undefined, {
              ...node.attrs,
              height,
              width,
            }),
          );
        }
      };

      container.appendChild(img);
      container.appendChild(overlay);
      container.appendChild(resizeHandle);

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
    handlePaste(_view, event) {
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
                      height: 150,
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

const handleCommand = (command: string) => {
  if (command === "rephrase") {
    handleRephrase();
  }
};

const handleRephrase = async () => {
  if (!editor.value || isRephrasing.value) return;

  const currentContent = editor.value.getText();

  if (!currentContent.trim()) {
    ElMessage.warning("Please enter some text to rephrase");
    return;
  }

  isRephrasing.value = true;

  try {
    const { result }: { result: string } = await post(url("llm/rephrase"), {
      text: currentContent,
    });

    // Set the rephrased content
    editor.value.commands.setContent(result);
  } catch (error) {
    console.error("Rephrase error:", error);
    ElMessage.error("Failed to rephrase content. Please try again.");
  } finally {
    isRephrasing.value = false;
  }
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

.resize-handle {
  z-index: 10;
}

.resize-handle:hover {
  opacity: 1 !important;
}

.editor-wrapper {
  position: relative;
}

.skeleton-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  z-index: 100;
  padding: 10px;
  border-radius: 3px;
}

.dark .skeleton-overlay {
  background: rgba(30, 30, 30, 0.95);
}
</style>
