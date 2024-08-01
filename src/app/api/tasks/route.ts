import clientPromise from '../../../lib/mongo';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function GET( request: NextRequest) {
  const { userId } = await getAuth( request);

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("taskmanager");
  const tasks = await db.collection("tasks").find({ userId }).toArray();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const { userId } = await getAuth(request);
//   console.log(userId);

  if (!userId) {
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
    userId, 
    title: trimmedTitle 
  });

  if (existingTask) {
    return NextResponse.json({ message: 'This task already exists' }, { status: 409 });
  }

  const result = await db.collection("tasks").insertOne({ 
    title: trimmedTitle, 
    userId,
    createdAt: new Date()
  });

  return NextResponse.json(result);
}
