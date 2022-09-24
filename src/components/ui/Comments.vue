<template>
    <el-button class="w-full !justify-start" text bg :icon="Comment" @click="openDrawer = true">
        <span v-if="comments.length === 0">Add comment</span>
        <span v-else>{{ comments.length }} {{ pluralize('comment', comments.length) }}</span>
    </el-button>

    <el-drawer v-model="openDrawer" direction="rtl" :with-header="false" size="40%">

        <div>
            <label class="block mb-3" for="comment-body">Add comment</label>
            <Editor id="comment-body" v-model="newComment.body" class="mb-3" />
            <el-button @click="addComment" class="w-full" type="primary">Add</el-button>
        </div>

        <p class="mt-5 mb-3 font-bold capitalize">{{ comments.length }} {{ pluralize('comment', comments.length) }}</p>

        <div v-for="comment in comments" class="bg-slate-100 mb-3 p-3 rounded">
            <div>
                <div class="prose mb-3" v-html="comment.body"></div>

                <div class="flex justify-between items-center">
                    <el-button type="danger" :icon="Delete" circle size="small" :loading="false" />
                    <p class=" text-xs">{{ comment.user.name }} &middot; 2 days ago</p>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script lang="ts" setup>

import { watchEffect, ref } from 'vue';
import { pluralize } from '@/helpers/string';
import { Comment, Delete } from '@element-plus/icons-vue'
import { url, get, post } from '@/helpers/http';
import Editor from './editor/Editor.vue';


const props = defineProps<{
    endPoint: string
}>()

type Comment = {
    id: number,
    body: string,
    user: User
    created_at: string,
    updated_at: string,
}

const openDrawer = ref<boolean>(false)

const comments = ref<Comment[]>([])

const newComment = ref({
    body: ''
})

watchEffect(() => {
    get(url(props.endPoint))
        .then(data => comments.value = data)
})

function addComment() {
    post(url(props.endPoint), newComment.value)
        .then(comment => {
            comments.value.push(comment)
            newComment.value.body = ''
        })
}

</script>