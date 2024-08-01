"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";

interface Task {
  _id: string;
  title: string;
  createdAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useKindeBrowserClient();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tasks");
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!newTask.trim()) {
      setError("Task cannot be empty");
      return;
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTask.trim() }),
      });

      if (response.ok) {
        setNewTask("");
        fetchTasks();
        toast({
          title: "Success",
          description: "Task added successfully!",
        });
      } else if (response.status === 409) {
        toast({
          title: "Warning",
          description: "This task already exists.",
          variant: "destructive",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add task");
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      setError("Failed to add task. Please try again.");
    }
  };

  const TaskSkeleton = () => (
    <div className="space-y-2">
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} className="h-[36px] w-full mt-4" />
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4 max-w-md pt-8">
        <SignedIn>
          <Card>
            <CardHeader>
              <CardTitle>Task List</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createTask} className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={newTask}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewTask(e.target.value)
                    }
                    placeholder="Enter a new task"
                  />
                  <Button type="submit">Add Task</Button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
              </form>
              {isLoading ? (
                <TaskSkeleton />
              ) : (
                <ul className="mt-4 space-y-2">
                  {tasks.map((task) => (
                    <li
                      key={task._id}
                      className="bg-secondary p-2 rounded flex justify-between items-center"
                    >
                      <span>{task.title}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </SignedIn>
        <SignedOut>
          <Card>
            <CardHeader>
              <CardTitle>Welcome to SimpleTask</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Please log in to manage your tasks.</p>
            </CardContent>
          </Card>
        </SignedOut>
      </main>
      <Toaster />
    </>
  );
}
