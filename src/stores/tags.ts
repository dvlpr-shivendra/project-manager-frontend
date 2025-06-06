import { get, url } from "@/helpers/http";
import { defineStore } from "pinia";

export const useTags = defineStore('tags', {
  state: () => ({
    list: [] as Tag[]
  }),

  actions: {
    getAll() {
      get(url('tags'))
        .then(tags => this.list = tags)
        .catch(error => console.log('error', error));
    },
  },
})