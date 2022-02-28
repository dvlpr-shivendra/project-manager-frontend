<template>
  <div class="h-screen w-screen grid place-content-center">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">Sign Up</div>
      </template>
      <el-form label-position="top" @submit.prevent="signUp">
        <el-form-item label="Name">
          <el-input v-model="credentials.name" required />
        </el-form-item>
        
        <el-form-item label="Email">
          <el-input v-model="credentials.email" required type="email" />
        </el-form-item>

        <el-form-item label="Password">
          <el-input v-model="credentials.password" type="password" required />
        </el-form-item>
        
        <el-form-item label="Confirm Password">
          <el-input v-model="credentials.password_confirmation" type="password" required />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">Sign Up</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { post, url } from '@/helpers/http';
import { setUserData } from '@/helpers/auth';
import { ref, type Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

type Credentials = {
  name: string
  email: string,
  password: string,
  password_confirmation: string
}

const router = useRouter()
const route = useRoute()

const credentials: Ref<Credentials> = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: ""
})

function signUp() {
  post(url('signup'), credentials.value)
    .then(res => res.json())
    .then(data => {
      setUserData(data)
      route.query.redirect 
        ? router.push({path: route.query.redirect as string}) 
        : router.push('/')
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