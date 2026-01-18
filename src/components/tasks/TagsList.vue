<template>
  <div class="my-6">
    <tag
      v-for="tag in tags"
      :key="tag.id"
      :background-color="tag.background_color"
      :color="tag.color"
      :text="tag.name"
      :closable="true"
      @close="emit('remove', tag.id)"
    />

    <tag
      background-color="#ccc"
      v-if="!showInput"
      color="#000"
      text="+ tag"
      @click="showInput = true"
    />

    <tag-form
      v-else
      :available-tags="availableTags"
      @add-new-tag="saveTagAndAdd"
      @add-tag="addTag"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Tag from "@/components/ui/Tag.vue";
import TagForm from "@/components/ui/TagForm.vue";
import { post, get, url } from "@/helpers/http";

const props = defineProps<{
  tags: Tag[];
}>();

const emit = defineEmits(["remove", "add"]);

const showInput = ref(false);
const availableTags = ref<Tag[]>([]);

function loadTags() {
  get(url("tags"))
    .then((tags) => (availableTags.value = tags))
    .catch(console.log);
}

onMounted(loadTags);

function addTag(tag: Tag) {
  emit("add", tag);
  showInput.value = false;
}

function saveTagAndAdd(newTag: NewTag) {
  post(url("tags"), newTag)
    .then((tag: Tag) => {
      availableTags.value.push(tag);
      addTag(tag);
    })
    .catch(console.log);
}
</script>
