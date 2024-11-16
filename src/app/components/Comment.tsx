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

  const submitComment = async (content: string) => {
    if (content.length > 0) {
      await fetch("/api/comment", {
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

  const deleteComment = async (id: number) => {
    await fetch("/api/comment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    refresh();
  };

  return (
    <div className={`flex flex-col gap-8 pl-4 ${comment?.parentCommentId && "border-l"}`}>
      <div className="flex flex-col gap-2">
        <p>{comment?.content}</p>
        {addComment && (
          <TextArea
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
          />
        )}
        <div className="flex flex-row gap-2">
          {addComment ? (
            <Button onClick={() => submitComment(commentText)}>Submit</Button>
          ) : (
            <Button onClick={() => setAddComment(true)}>{comment?.content ? "Reply" : "Add comment"}</Button>
          )}
          {comment?.id && !addComment && (
            <Button
              onClick={() => {
                deleteComment(comment.id);
              }}
              variant="outline"
              color="red"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      {comment &&
        comment?.childComments?.length > 0 &&
        comment.childComments.map((childComment) => {
          return <Comment key={childComment.id} comment={childComment} />;
        })}
    </div>
  );
};
