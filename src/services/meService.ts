import { get, url } from "@/helpers/http";

export async function fetchMe(): Promise<User> {
  return await get(url("me"));
}
