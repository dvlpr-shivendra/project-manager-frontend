<template>
  <el-dialog
    v-model="visible"
    :width="'95%'"
    align-center
    :show-close="false"
    destroy-on-close
    :z-index="9010"
    @close="handleClose"
  >
    <div class="lightbox-container relative">
      <!-- Toolbar -->
      <div class="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-black bg-opacity-50">
        <div class="flex items-center gap-2">
          <el-tooltip content="Zoom Out" placement="bottom">
            <button
              class="p-2 bg-white rounded hover:bg-gray-200 transition-colors"
              :disabled="scale <= 0.5"
              type="button"
              @click="zoomOut"
            >
              <el-icon :size="20">
                <ZoomOut />
              </el-icon>
            </button>
          </el-tooltip>
          
          <span class="text-white font-medium px-3">{{ Math.round(scale * 100) }}%</span>
          
          <el-tooltip content="Zoom In" placement="bottom">
            <button
              class="p-2 bg-white rounded hover:bg-gray-200 transition-colors"
              :disabled="scale >= 3"
              type="button"
              @click="zoomIn"
            >
              <el-icon :size="20">
                <ZoomIn />
              </el-icon>
            </button>
          </el-tooltip>
          
          <el-tooltip content="Reset Zoom" placement="bottom">
            <button
              class="p-2 bg-white rounded hover:bg-gray-200 transition-colors"
              type="button"
              @click="resetZoom"
            >
              <el-icon :size="20">
                <RefreshLeft />
              </el-icon>
            </button>
          </el-tooltip>
        </div>
        
        <el-tooltip content="Close" placement="bottom">
          <button
            class="p-2 bg-white rounded hover:bg-gray-200 transition-colors"
            type="button"
            @click="handleClose"
          >
            <el-icon :size="20">
              <Close />
            </el-icon>
          </button>
        </el-tooltip>
      </div>
      
      <!-- Image Container -->
      <div 
        class="image-wrapper flex items-center justify-center min-h-[80vh] max-h-[80vh] overflow-auto p-4"
        @wheel="handleWheel"
        ref="imageContainer"
      >
        <img 
          :src="imageSrc" 
          :style="imageStyle"
          class="max-w-none cursor-move transition-transform duration-200"
          alt="Preview"
          draggable="false"
          @mousedown="startDrag"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { ZoomIn, ZoomOut, Close, RefreshLeft } from "@element-plus/icons-vue";

const props = defineProps<{
  modelValue: boolean;
  imageSrc: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);

const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) translate(${translateX.value}px, ${translateY.value}px)`,
  transformOrigin: "center center",
}));

const zoomIn = () => {
  if (scale.value < 3) {
    scale.value = Math.min(3, scale.value + 0.25);
  }
};

const zoomOut = () => {
  if (scale.value > 0.5) {
    scale.value = Math.max(0.5, scale.value - 0.25);
  }
};

const resetZoom = () => {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
};

const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
};

const startDrag = (e: MouseEvent) => {
  if (scale.value <= 1) return;
  
  isDragging.value = true;
  dragStartX.value = e.clientX - translateX.value;
  dragStartY.value = e.clientY - translateY.value;
  
  const onMouseMove = (moveEvent: MouseEvent) => {
    if (isDragging.value) {
      translateX.value = moveEvent.clientX - dragStartX.value;
      translateY.value = moveEvent.clientY - dragStartY.value;
    }
  };
  
  const onMouseUp = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };
  
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

const handleClose = () => {
  resetZoom();
  visible.value = false;
};

// Reset zoom when image changes
watch(() => props.imageSrc, () => {
  resetZoom();
});

// Reset zoom when dialog opens
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    resetZoom();
  }
});
</script>

<style scoped>
.lightbox-container {
  background: #000;
}

.image-wrapper {
  cursor: grab;
}

.image-wrapper:active {
  cursor: grabbing;
}
</style>