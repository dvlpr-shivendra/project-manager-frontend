<template>
  <button @click="openDrawer = true" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 hover:border-indigo-300 dark:hover:border-indigo-800 text-gray-600 dark:text-gray-400 text-[13px] font-medium transition-all cursor-pointer">
    <Comment style="width:14px;height:14px;" class="text-gray-400 shrink-0" />
    <span v-if="comments.length === 0">Add comment</span>
    <span v-else>{{ comments.length }} {{ pluralize('comment', comments.length) }}</span>
  </button>
  <el-drawer v-model="openDrawer" direction="rtl" :with-header="false" size="480px">
    <div class="flex flex-col h-full p-5 gap-5">
      <h2 class="font-['Syne'] font-bold text-xl text-gray-900 dark:text-white">Comments<span v-if="comments.length" class="ml-2 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold">{{ comments.length }}</span></h2>
      <div class="flex flex-col gap-2">
        <p class="text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">New comment</p>
        <Editor v-model="newComment.body" />
        <button @click="addComment" class="self-end px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold transition-colors cursor-pointer">Post comment</button>
      </div>
      <div v-if="comments.length" class="border-t border-gray-100 dark:border-gray-800"></div>
      <div class="flex flex-col gap-4 flex-1 overflow-y-auto">
        <TransitionGroup name="list">
          <div v-for="comment in comments" :key="comment.id" class="flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">{{ comment.user.name?.[0]?.toUpperCase() }}</div>
                <span class="text-[13px] font-semibold text-gray-800 dark:text-gray-200">{{ comment.user.name }}</span>
              </div>
              <span class="text-[11px] text-gray-400 dark:text-gray-600">{{ comment.created_at }}</span>
            </div>
            <div class="ml-9 prose text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed" v-html="comment.body"></div>
            <div class="ml-9 pt-2 border-b border-gray-100 dark:border-gray-800"></div>
          </div>
        </TransitionGroup>
        <div v-if="comments.length === 0" class="flex flex-col items-center gap-2 py-8 text-gray-400 dark:text-gray-600 text-[13px]">No comments yet. Be the first!</div>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { watchEffect, ref } from 'vue';
import { pluralize } from '@/helpers/string';
import { Comment } from '@element-plus/icons-vue';
import { url, get, post } from '@/helpers/http';
import Editor from './editor/Editor.vue';
const props = defineProps<{ endPoint: string }>();
type CommentType = { id: number; body: string; user: User; created_at: string; updated_at: string };
const openDrawer = ref(false);
const comments = ref<CommentType[]>([]);
const newComment = ref({ body: '' });
watchEffect(() => { get(url(props.endPoint)).then(data => (comments.value = data)); });
function addComment() { post(url(props.endPoint), newComment.value).then(comment => { comments.value.push(comment); newComment.value.body = ''; }); }
</script>
