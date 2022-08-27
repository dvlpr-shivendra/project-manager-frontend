<template>
    <div>
        <strong class="leading-6" v-if="leadingTag" v-text="leadingTag.name" :closable="true" />&nbsp;
        <el-tooltip placement="top" v-if="tags.length > 1">
            <template #content>
                {{ tooltipContent }}
            </template>
            <span class="cursor-pointer underline">+ {{ tags.length - 1 }}
                more</span>
        </el-tooltip>
    </div>
</template>

<script lang="ts" setup>
import Tag from '@/components/ui/Tag.vue';
import { computed } from '@vue/reactivity';

const props = defineProps<{
    tags: Tag[]
}>()

const leadingTag = computed(() => {
    if (props.tags.length > 0) {
        return props.tags[0]
    }
})

const tooltipContent = computed(() => {
    const tooltipTags = props.tags.filter((_, index) => index !== 0)

    return tooltipTags.map(tag => tag.name).join(', ')
})
</script>