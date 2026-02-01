<template>
  <span>
    <el-select
      :key="`tag-${tags.length}`"
      v-model="model"
      filterable
      allow-create
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
import { computed, ref, nextTick } from "vue";
import TagFormDialog from "@/components/TagFormDialog.vue";
import Tag from "@/components/ui/Tag.vue";

const props = defineProps<{
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
  async set(value: (number | string)[]) {
    const latestInput: number | string | undefined = value.pop();
    if (latestInput === undefined) return;
    else if (typeof latestInput === "string") {
      await nextTick();
      prefillTag.value = {
        name: latestInput,
        color: "#000000",
        background_color: "#ffffff",
      } as Tag;
      // dialogVisible.value = true;
    } else {
      const tag = tagsMap.value[latestInput as number];
      emit("update:modelValue", [...props.modelValue, tag]);
    }
  },
});

const onSaved = (tag: Tag) => {
  emit("addTag", tag);
  dialogVisible.value = false;
};
</script>
