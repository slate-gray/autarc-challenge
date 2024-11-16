"use client";

import { Prisma } from "@prisma/client";
import { TextArea, Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type Comment = Omit<Prisma.CommentGetPayload<{ include: { childComments: true } }>, "childComments"> & {
  childComments: Comment[];
};

interface CommentProps {
  comment: Comment | undefined;
}

export const Comment = (props: CommentProps) => {
  const { comment } = props;
  const { refresh } = useRouter();

  const [addComment, setAddComment] = useState(false);
  const [commentText, setCommentText] = useState("");

  const submitComment = (content: string) => {
    if (content.length > 0) {
      fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parentCommentId: comment?.id, content: content }),
      });
      setAddComment(false);
      setCommentText("");
      refresh();
    }
  };

  const deleteComment = (id: number) => {
    fetch("/api/comment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    refresh();
  };

  return (
    <div className="pl-4">
      <p>{comment?.content}</p>
      {addComment && (
        <TextArea
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
          }}
        />
      )}
      {addComment ? (
        <Button onClick={() => submitComment(commentText)}>Submit</Button>
      ) : (
        <Button onClick={() => setAddComment(true)}>{comment?.content ? "Reply" : "Add comment"}</Button>
      )}
      {comment?.id && (
        <Button
          onClick={() => {
            deleteComment(comment.id);
          }}
        >
          Delete
        </Button>
      )}
      {comment &&
        comment?.childComments?.length > 0 &&
        comment.childComments.map((childComment) => {
          return <Comment key={childComment.id} comment={childComment} />;
        })}
    </div>
  );
};
