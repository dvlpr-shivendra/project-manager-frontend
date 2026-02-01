<template>
  <div class="my-6"></div>
</template>

<script lang="ts" setup>
// import { ref  } from "vue";

const props = defineProps<{
  tags: Tag[];
}>();

const emit = defineEmits(["remove", "add"]);

// const showInput = ref(false);

// function addTag(tag: Tag) {
//   emit("add", tag);
//   showInput.value = false;
// }

// function saveTagAndAdd(newTag: NewTag) {
//   post(url("tags"), newTag)
//     .then((tag: Tag) => {
//       availableTags.value.push(tag);
//       addTag(tag);
//     })
//     .catch(console.log);
// }
</script>
