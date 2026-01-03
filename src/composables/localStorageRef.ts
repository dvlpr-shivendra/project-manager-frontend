import { ref, watch } from 'vue'

export function localStorageRef<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key)
  const r = ref<T>(stored ? JSON.parse(stored) : defaultValue)

  watch(r, v => localStorage.setItem(key, JSON.stringify(v)), { deep: true })
  return r
}
