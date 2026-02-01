<template>
  <span>
    <el-select
      :key="`tag-${tags.length}`"
      v-model="model"
      filterable
      multiple
      default-first-option
      :reserve-keyword="false"
      no-data-text="Enter the tag name and press enter"
      placeholder="Choose tags"
    >
      <el-option
        v-for="item in tags"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
        <div class="flex items-center">
          <tag
            :key="item.color"
            :text="item.name"
            :color="item.color"
            :background-color="item.background_color"
          />
        </div>
      </el-option>
      <template #tag>
        <div v-for="tagId in model">
          <tag
            :key="tagsMap[tagId].color"
            :text="tagsMap[tagId].name"
            :color="tagsMap[tagId].color"
            :background-color="tagsMap[tagId].background_color"
          />
        </div>
      </template>
    </el-select>

    <TagFormDialog v-model="dialogVisible" :tag="prefillTag" @saved="onSaved" />
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import TagFormDialog from "@/components/TagFormDialog.vue";
import Tag from "@/components/ui/Tag.vue";
import { url, post, destroy } from "@/helpers/http";
import { ElMessage } from "element-plus";

const props = defineProps<{
  taskId: number;
  tags: Tag[];
  modelValue: Tag[];
}>();

const emit = defineEmits(["addTag", "update:modelValue"]);

type TagsMap = Record<Tag["id"], Tag>;

const tagsMap = computed<TagsMap>(() =>
  props.tags.reduce((t, tag) => {
    t[tag.id] = tag;
    return t;
  }, {} as TagsMap),
);

const dialogVisible = ref(false);

const prefillTag = ref<Tag | null>(null);

const model = computed({
  get() {
    return props.modelValue.map((t) => t.id);
  },
  async set(value: number[]) {
    emit(
      "update:modelValue",
      value.map((tagId) => tagsMap.value[tagId]),
    );
  },
});

watch(
  model,
  (newValue, oldValue = []) => {
    if (newValue.length > oldValue.length) {
      const added = newValue.find((id) => !oldValue.includes(id));
      if (added) addTag(added);
    } else if (newValue.length < oldValue.length) {
      const removed = oldValue.find((id) => !newValue.includes(id));
      if (removed) removeTag(removed);
    }
  },
  { immediate: false },
);

function addTag(tagId: number) {
  try {
    post(url(`tasks/${props.taskId}/tags/${tagId}`));
    ElMessage({
      message: "Task updated successfully.",
      type: "success",
      grouping: true,
    });
  } catch (e: any) {
    ElMessage.error(e?.message || "Task could not be updated.");
  }
}

function removeTag(tagId: number) {
  try {
    destroy(url(`tasks/${props.taskId}/tags/${tagId}`));
    ElMessage({
      message: "Task updated successfully.",
      type: "success",
      grouping: true,
    });
  } catch (e: any) {
    ElMessage.error(e?.message || "Task could not be updated.");
  }
}

const onSaved = (tag: Tag) => {
  dialogVisible.value = false;
};
</script>
