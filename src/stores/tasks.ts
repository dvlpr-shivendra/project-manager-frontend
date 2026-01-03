import { destroy, get, post, put, url } from "@/helpers/http";
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
      get(url)
        .then(({ data, next_page_url, current_page, last_page, total }) => {
          this.list = data
          this.pagination = { next_page_url, current_page, last_page, total }
        })
        .catch(error => {
          console.log('error', error)
        })
        .finally(() => this.loading = false)
    },

    async add(data: TaskForm) {
      try {
        const task = await post(url('tasks'), data)
        this.list.unshift(task)
        return task;
      } catch (error) {
        throw error;
      }
    },

    remove(id: number) {
      destroy(url(`tasks/${id}`))
        .then(() => this.list = this.list.filter(task => task.id !== id))
        .catch(e => console.log(e))
    },

    async removeMany(ids: number[]) {
      await destroy(url("tasks/bulk"), { ids });
      this.list = this.list.filter(task => !ids.includes(task.id));
    },

     async update(task: Task) {
      await put(url(`tasks/${task.id}`), task);
      const i = this.list.findIndex(t => t.id === task.id);
      if (i !== -1) this.list[i] = { ...task };
    },
  },
})