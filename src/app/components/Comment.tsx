"use client";

import { Prisma } from "@prisma/client";

export type Comment = Omit<Prisma.CommentGetPayload<{ include: { childComments: true } }>, "childComments"> & {
  childComments: Comment[];
};

interface CommentProps {
  comment: Comment;
}

export const Comment = (props: CommentProps) => {
  const { comment } = props;

  return (
    <div className="pl-4">
      <p>{comment.content}</p>
      {comment?.childComments?.length > 0 &&
        comment.childComments.map((childComment) => {
          return <Comment key={childComment.id} comment={childComment} />;
        })}
    </div>
  );
};
