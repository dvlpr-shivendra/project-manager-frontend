<template>
    <el-input :placeholder="placeholder" class="filter" v-model="model" @keypress.enter="emit('change', model)" />
</template>


<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';


const props = defineProps<{
    placeholder: string,
    routeKey: string,
}>()

const emit = defineEmits(['change'])

const route = useRoute()

const model = ref(route.query[props.routeKey] as string || "" )

</script>

<style>
.filter .el-input__inner {
    --el-input-border: none;
}
</style>