"use client";

import { Prisma } from "@prisma/client";
import { TextArea, Button } from "@radix-ui/themes";
import { useState } from "react";

export type Comment = Omit<Prisma.CommentGetPayload<{ include: { childComments: true } }>, "childComments"> & {
  childComments: Comment[];
};

interface CommentProps {
  comment: Comment;
}

export const Comment = (props: CommentProps) => {
  const { comment } = props;

  const [commentText, setCommentText] = useState("");
  return (
    <div className="pl-4">
      <p>{comment.content}</p>
      <TextArea onChange={(e) => setCommentText(e.target.value)} />
      <Button
        onClick={() => {
          fetch("/api/comment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ parentCommentId: comment.id, content: commentText }),
          });
        }}
      >
        Reply
      </Button>
      {comment?.childComments?.length > 0 &&
        comment.childComments.map((childComment) => {
          return <Comment key={childComment.id} comment={childComment} />;
        })}
    </div>
  );
};
