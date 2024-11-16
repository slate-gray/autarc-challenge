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

  const [commentText, setCommentText] = useState("");
  return (
    <div className="pl-4">
      <p>{comment?.content}</p>
      <TextArea
        value={commentText}
        onChange={(e) => {
          setCommentText(e.target.value);
        }}
      />
      <Button
        onClick={() => {
          if (commentText.length > 0) {
            fetch("/api/comment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ parentCommentId: comment?.id, content: commentText }),
            });
            setCommentText("");
            refresh();
          }
        }}
      >
        {comment?.content ? "Reply" : "Add comment"}
      </Button>
      {comment?.id && (
        <Button
          onClick={() => {
            fetch("/api/comment", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: comment?.id }),
            });
            refresh();
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
