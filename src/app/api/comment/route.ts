import { NextRequest } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = await prisma.comment.create({
    data: { parentCommentId: body.parentCommentId, content: body.content },
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
