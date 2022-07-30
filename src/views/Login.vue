<template>
  <div class="h-full w-full grid place-content-center">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">Login</div>
      </template>
      <el-form label-position="top" @submit.prevent="login">
        <el-form-item label="Email">
          <el-input v-model="credentials.email" required />
        </el-form-item>

        <el-form-item label="Password">
          <el-input v-model="credentials.password" type="password" required />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { post, url } from '@/helpers/http';
import { setUserData } from '@/helpers/auth';
import { ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

type Credentials = {
  email: string,
  password: string,
}

const router = useRouter()
const route = useRoute()

const credentials: Ref<Credentials> = ref({
  email: "",
  password: "",
})

function login() {
  post(url('login'), credentials.value)
    .then(data => {
      setUserData(data)
      route.query.redirect 
        ? window.location.replace(route.query.redirect as string) 
        : window.location.replace('/')
    })
    .catch(e => console.log(e))
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>