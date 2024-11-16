import { NextRequest } from "next/server";
import prisma from "../../../../lib/prisma";

interface CommentRequest extends NextRequest {
  parentCommentId: number;
  content: string;
}

export async function POST(request: CommentRequest) {
  const body = await request.json();
  const data = await prisma.comment.create({
    data: { parentCommentId: body.parentCommentId, content: body.content, authorId: 1 },
  });

  return Response.json(data);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const data = await prisma.comment.delete({
    where: { id: body.id },
  });

  return Response.json(data);
}
