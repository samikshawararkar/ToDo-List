import { type NextRequest, NextResponse } from "next/server"

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

// In-memory storage (same reference as in route.ts)
// In production, you'd use a database
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

// PUT /api/todos/[id] - Update a todo
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const todoIndex = todos.findIndex((todo) => todo.id === id)

    if (todoIndex === -1) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    // Update the todo with provided fields
    if (typeof body.completed === "boolean") {
      todos[todoIndex].completed = body.completed
    }

    if (typeof body.text === "string" && body.text.trim() !== "") {
      todos[todoIndex].text = body.text.trim()
    }

    return NextResponse.json(todos[todoIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const todoIndex = todos.findIndex((todo) => todo.id === id)

  if (todoIndex === -1) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 })
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0]

  return NextResponse.json(deletedTodo)
}
