import { Prisma } from "@prisma/client";
import prisma from "../../../lib/prisma";
import { Comment } from "./Comment";

export const CommentsList = async () => {
  // Prisma currently doesn't support recursive relationships (https://github.com/prisma/prisma/issues/3725)
  // so we fetch all comments and assemble our structure recursively here
  const comments = await prisma.comment.findMany({
    include: { childComments: true },
  });

  const nest = (
    items: Prisma.CommentGetPayload<{ include: { childComments: true } }>[],
    id: number | null = null
  ): Comment[] =>
    items
      .filter((item) => item.parentCommentId === id)
      .map((item) => ({ ...item, childComments: nest(items, item.id) }));

  const nestedComments = nest(comments);

  return (
    <div className="max-w-2xl flex flex-col gap-8 items-start">
      {nestedComments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      <Comment comment={undefined} />
    </div>
  );
};
