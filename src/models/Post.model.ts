import * as t from "io-ts";

export const Post = t.type({
  id: t.number,
  userId: t.number,
  title: t.string,
  body: t.string,
});
export type Post = t.TypeOf<typeof Post>;

export const PostFunctions = {
  getTitle: (p: Post) => p.title,
};
