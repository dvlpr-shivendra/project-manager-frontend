import { get, post, put, destroy, url } from '@/helpers/http';

export interface Tag {
  id: number;
  name: string;
  color: string;
  background_color: string;
}

export interface TagInput {
  name: string;
  color: string;
  background_color: string;
}

export const tagService = {
  async getAll(): Promise<Tag[]> {
    return get(url('tags'));
  },

  async getById(id: number): Promise<Tag> {
    return get(url(`tags/${id}`));
  },

  async create(data: TagInput): Promise<Tag> {
    return post(url('tags'), data);
  },

  async update(id: number, data: TagInput): Promise<Tag> {
    return put(url(`tags/${id}`), data);
  },

  async delete(id: number): Promise<void> {
    return destroy(url(`tags/${id}`));
  },
};