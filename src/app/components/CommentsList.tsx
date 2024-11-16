import prisma from "../../../lib/prisma";

export const CommentsList = async () => {
  const comments = await prisma.comment.findMany();
  console.log(comments);

  return <p>{comments.map((comment) => comment.content)}</p>;
};
