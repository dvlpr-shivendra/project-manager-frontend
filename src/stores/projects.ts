import { destroy, get, post, url } from "@/helpers/http";
import { defineStore } from "pinia";

export const useProjects = defineStore("projects", {
  state: () => ({
    loading: false,
    list: [] as Project[],
    pagination: <Pagination>{},
  }),

  actions: {
    getAll() {
      this.loading = true;
      get(this.pagination.next_page_url || url("projects"))
        .then(({ data, next_page_url, current_page, last_page, total }) => {
          this.list = data;
          this.pagination = { next_page_url, current_page, last_page, total };
        })
        .catch((error) => console.log("error", error))
        .finally(() => (this.loading = false));
    },

    add(data: ProjectForm) {
      post(url("projects"), data)
        .then((task) => this.list.push(task))
        .catch((e) => console.log(e));
    },

    remove(id: number) {
      destroy(url(`projects/${id}`)).then(() => {
        this.list = this.list.filter((project) => project.id !== id);
      });
    },
  },
});
