import { get, url } from "@/helpers/http";
import { defineStore } from "pinia";

export const useTasks = defineStore('tasks', {
  state: () => ({
    list: [] as Task[],
    pagination: <Pagination>{}
  }),

  actions: {
    getAll(projectId: string) {
      get(this.pagination.next_page_url || url(`tasks?project_id=${projectId}`))
        .then(response => response.json())
        .then(({ data, next_page_url, current_page, last_page }) => {
          this.list = data
          this.pagination = { next_page_url, current_page, last_page }
        })
        .catch(error => console.log('error', error));
    },
  },
})