<template>
  <div class="min-h-screen flex bg-white dark:bg-gray-950">
    <div class="hidden lg:flex flex-col justify-between w-[45%] bg-gray-950 dark:bg-gray-900 p-10 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      <div class="relative z-10 flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-white"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
        <span class="font-['Syne'] font-bold text-lg text-white">{{ appTitle }}</span>
      </div>
      <div class="relative z-10">
        <h1 class="font-['Syne'] font-extrabold text-4xl text-white leading-tight mb-3">Start managing<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">smarter today.</span></h1>
        <p class="text-gray-400 text-[15px] leading-relaxed mb-6 max-w-xs">Join your team on {{ appTitle }} and take control of your projects from day one.</p>
        <ul class="flex flex-col gap-2">
          <li v-for="feat in features" :key="feat" class="flex items-center gap-2.5 text-gray-400 text-[13px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-indigo-400 shrink-0"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>{{ feat }}
          </li>
        </ul>
      </div>
      <p class="relative z-10 text-gray-600 text-[12px]">© {{ new Date().getFullYear() }} {{ appTitle }}</p>
    </div>
    <div class="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-gray-950">
      <div class="w-full max-w-sm">
        <div class="lg:hidden flex items-center gap-2.5 mb-8">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-white"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
          <span class="font-['Syne'] font-bold text-[17px] text-gray-900 dark:text-white">{{ appTitle }}</span>
        </div>
        <h2 class="font-['Syne'] font-bold text-2xl text-gray-900 dark:text-white mb-1">Create your account</h2>
        <p class="text-gray-500 dark:text-gray-400 text-[14px] mb-7">Get started in seconds — no credit card needed.</p>
        <el-form label-position="top" @submit.prevent="signUp" @keyup="handleKeyUp" class="flex flex-col gap-1">
          <el-form-item label="Full name" :error="errors.name"><el-input v-model="credentials.name" placeholder="Jane Smith" required name="name" size="large" /></el-form-item>
          <el-form-item label="Email address" :error="errors.email"><el-input v-model="credentials.email" type="email" placeholder="you@example.com" required name="email" size="large" /></el-form-item>
          <el-form-item label="Password" :error="errors.password"><el-input v-model="credentials.password" type="password" placeholder="At least 8 characters" required name="password" size="large" show-password /></el-form-item>
          <el-form-item label="Confirm password" :error="errors.password_confirmation"><el-input v-model="credentials.password_confirmation" type="password" placeholder="Repeat your password" required name="password_confirmation" size="large" show-password /></el-form-item>
          <button type="submit" :disabled="loading" class="mt-2 w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-[14px] transition-all shadow-sm hover:shadow-indigo-500/25 hover:shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" stroke-dashoffset="12"/></svg>
            {{ loading ? 'Creating account…' : 'Create account' }}
          </button>
        </el-form>
        <p class="mt-6 text-center text-[13px] text-gray-500 dark:text-gray-400">Already have an account? <router-link to="/login" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 ml-1 no-underline">Sign in</router-link></p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { post, url } from '@/helpers/http';
import { setUserData } from '@/helpers/auth';
import { handleAPIException } from '@/helpers/apiExceptionHandler';
type Credentials = { name: string; email: string; password: string; password_confirmation: string };
const route = useRoute();
const appTitle = import.meta.env.VITE_APP_TITLE;
const features = ['Free to get started','Invite unlimited teammates','Task tracking & assignments','File attachments & comments'];
const credentials: Ref<Credentials> = ref({ name: '', email: '', password: '', password_confirmation: '' });
const errors: Ref<{ [key: string]: string }> = ref({});
const loading: Ref<boolean> = ref(false);
function signUp() { loading.value = true; post(url('signup'), credentials.value).then(data => { setUserData(data); route.query.redirect ? window.location.replace(route.query.redirect as string) : window.location.replace('/'); }).catch(e => handleAPIException(e, errors)).finally(() => (loading.value = false)); }
function handleKeyUp(e: any) { errors.value[e.target.getAttribute('name')] = ''; }
</script>
