import { destroy, get, post, url } from "@/helpers/http";
import { defineStore } from "pinia";

export const useTasks = defineStore('tasks', {
  state: () => ({
    loading: false,
    list: [] as Task[],
    pagination: <Pagination>{}
  }),

  actions: {
    getAll(url: string) {
      this.loading = true;
      get(this.pagination.next_page_url || url)
        .then(({ data, next_page_url, current_page, last_page }) => {
          this.list = data
          this.pagination = { next_page_url, current_page, last_page }
        })
        .catch(error => {
          console.log('error', error)
        })
        .finally(() => this.loading = false)
    },

    add(data: TaskForm) {
      post(url('tasks'), data)
        .then(task => this.list.push(task))
        .catch(e => console.log(e))
    },

    remove(id: number) {
      destroy(url(`tasks/${id}`))
        .then(() => this.list = this.list.filter(task => task.id !== id))
        .catch(e => console.log(e))
    }
  },
})