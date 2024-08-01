import clientPromise from '../../../lib/mongo';
import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("taskmanager");
  const tasks = await db.collection("tasks").find({ userId: user.id }).toArray();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("taskmanager");
  const { title } = await request.json();

  if (!title || title.trim() === '') {
    return NextResponse.json({ message: 'Task title cannot be empty' }, { status: 400 });
  }

  const trimmedTitle = title.trim();

  // Check if the task already exists for this user
  const existingTask = await db.collection("tasks").findOne({ 
    userId: user.id, 
    title: trimmedTitle 
  });

  if (existingTask) {
    return NextResponse.json({ message: 'This task already exists' }, { status: 409 });
  }

  const result = await db.collection("tasks").insertOne({ 
    title: trimmedTitle, 
    userId: user.id,
    createdAt: new Date()
  });

  return NextResponse.json(result);
}