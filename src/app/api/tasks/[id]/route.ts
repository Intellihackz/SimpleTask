import clientPromise from "@/lib/mongo";
import { getAuth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

//Delete
export async function DELETE(request: NextRequest, { params }: any) {
  const { userId } = await getAuth(request);
  const { id } = params;
  console.log(id)

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("taskmanager");
  // const { id } = await request.json();
  // console.log(id);

  if (!id) {
    return NextResponse.json(
      { message: "Task ID is required" },
      { status: 400 }
    );
  }
  const result = await db
    .collection("tasks")
    .deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json(result);
}
