import { destroy, get, post, url } from "@/helpers/http";
import { defineStore } from "pinia";

export const useProjects = defineStore('projects', {
  state: () => ({
    list: [] as Project[],
    pagination: <Pagination>{}
  }),

  actions: {
    getAll() {
      get(this.pagination.next_page_url || url('projects'))
        .then(({ data, next_page_url, current_page, last_page }) => {
          this.list = data
          this.pagination = { next_page_url, current_page, last_page }
        })
        .catch(error => console.log('error', error));
    },

    add(data: ProjectForm) {
      post(url('projects'), data)
        .then(task => this.list.push(task))
        .catch(e => console.log(e))
    },

    remove(id: number) {
      destroy(url(`projects/${id}`))
        .then(() => {
          this.list = this.list.filter(project => project.id !== id)
        })
    }
  },
})