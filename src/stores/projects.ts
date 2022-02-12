import { get, url } from "@/helpers/http";
import { defineStore } from "pinia";

export const useProjects = defineStore('projects', {
  state: () => ({
    list: [] as Project[],
    pagination: <Pagination>{}
  }),

  actions: {
    getAll() {
      get(this.pagination.next_page_url || url('projects'))
        .then(response => response.json())
        .then(({ data, next_page_url, current_page, last_page }) => {
          this.list = data
          this.pagination = { next_page_url, current_page, last_page }
        })
        .catch(error => console.log('error', error));
    },
  },
})