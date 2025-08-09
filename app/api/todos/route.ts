import { type NextRequest, NextResponse } from "next/server"

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

// In-memory storage (in production, you'd use a database)
const todos: Todo[] = [
  {
    id: "1",
    text: "Welcome to your todo list!",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    text: "Click the checkbox to mark items as complete",
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

// GET /api/todos - Get all todos
export async function GET() {
  return NextResponse.json(todos)
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }

    todos.push(newTodo)

    return NextResponse.json(newTodo, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
