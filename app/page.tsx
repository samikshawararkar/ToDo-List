"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit2, Plus, Save, X, Star, Sparkles, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedCard } from "@/components/animated-card"

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos")
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (newTodo.trim() === "") return

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTodo.trim() }),
      })

      if (response.ok) {
        const todo = await response.json()
        setTodos([...todos, todo])
        setNewTodo("")
        toast({
          title: "Success",
          description: "Todo added successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      })
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      })

      if (response.ok) {
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id))
        toast({
          title: "Success",
          description: "Todo deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      })
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = async () => {
    if (editText.trim() === "" || !editingId) return

    try {
      const response = await fetch(`/api/todos/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editText.trim() }),
      })

      if (response.ok) {
        setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editText.trim() } : todo)))
        setEditingId(null)
        setEditText("")
        toast({
          title: "Success",
          description: "Todo updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating Decorative Elements */}
        <div className="floating-element absolute top-20 left-10 text-purple-300/40">
          <Star size={24} />
        </div>
        <div className="floating-element-delayed absolute top-40 right-20 text-pink-300/40">
          <Sparkles size={28} />
        </div>
        <div className="floating-element absolute bottom-40 left-20 text-blue-300/40">
          <CheckCircle2 size={32} />
        </div>
        <div className="floating-element-delayed absolute bottom-20 right-10 text-indigo-300/40">
          <Star size={20} />
        </div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <motion.h1
              className="text-7xl font-black mb-6 relative"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent bg-300% animate-gradient">
                ✨ TaskMaster Pro ✨
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 blur-lg -z-10 animate-pulse"></div>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Elevate your productivity with our beautifully crafted task management experience
            </motion.p>
          </motion.div>

          {/* Add Todo Section */}
          <AnimatedCard delay={0.2} className="mb-8">
            <div className="glass-card p-8 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl bg-white/10">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center justify-between text-2xl">
                  <motion.span className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-bold">
                      Create New Task
                    </span>
                  </motion.span>
                  <motion.div
                    className="progress-badge"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {completedCount}/{totalCount} Complete
                    </span>
                  </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <motion.div className="flex-1" whileFocus={{ scale: 1.01 }}>
                    <Input
                      type="text"
                      placeholder="What amazing task will you conquer today? 🚀"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addTodo()
                        }
                      }}
                      className="h-14 text-lg border-2 border-purple-200/50 focus:border-purple-400 bg-white/80 backdrop-blur-sm rounded-xl shadow-inner placeholder:text-gray-500 transition-all duration-300"
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={addTodo}
                      disabled={!newTodo.trim()}
                      className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Task
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </div>
          </AnimatedCard>

          {/* Todo List */}
          <div className="space-y-4">
            <AnimatePresence>
              {todos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatedCard delay={0.4}>
                    <div className="glass-card p-12 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl bg-white/10 text-center">
                      <motion.div
                        className="text-8xl mb-8"
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        🎯
                      </motion.div>
                      <motion.h3
                        className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      >
                        Ready to Achieve Greatness?
                      </motion.h3>
                      <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                        Your journey to productivity starts here. Add your first task and watch the magic happen! ✨
                      </p>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ) : (
                todos.map((todo, index) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, x: -50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 120,
                    }}
                    layout
                  >
                    <AnimatedCard>
                      <div
                        className={`glass-card p-6 rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300 ${
                          todo.completed
                            ? "border-emerald-200/50 bg-emerald-50/20"
                            : "border-white/20 bg-white/10 hover:bg-white/20"
                        }`}
                      >
                        <CardContent className="p-0">
                          <div className="flex items-center gap-4">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Checkbox
                                id={`todo-${todo.id}`}
                                checked={todo.completed}
                                onCheckedChange={(checked) => toggleTodo(todo.id, checked as boolean)}
                                className="w-6 h-6 border-2 border-purple-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500 data-[state=checked]:border-emerald-500 rounded-lg shadow-sm"
                              />
                            </motion.div>

                            <div className="flex-1">
                              {editingId === todo.id ? (
                                <motion.div
                                  className="flex gap-3"
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                >
                                  <Input
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        saveEdit()
                                      } else if (e.key === "Escape") {
                                        cancelEdit()
                                      }
                                    }}
                                    className="flex-1 h-12 border-2 border-blue-200/50 focus:border-blue-400 bg-white/80 backdrop-blur-sm rounded-lg"
                                    autoFocus
                                  />
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="sm"
                                      onClick={saveEdit}
                                      disabled={!editText.trim()}
                                      className="h-12 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg"
                                    >
                                      <Save className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={cancelEdit}
                                      className="h-12 px-4 border-2 border-gray-200 hover:border-gray-300 rounded-lg bg-transparent"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                </motion.div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <motion.label
                                    htmlFor={`todo-${todo.id}`}
                                    className={`cursor-pointer flex-1 text-lg font-medium transition-all duration-300 ${
                                      todo.completed
                                        ? "text-gray-500 line-through opacity-75"
                                        : "text-gray-800 hover:text-purple-600"
                                    }`}
                                    whileHover={{ scale: 1.01 }}
                                  >
                                    {todo.completed && (
                                      <motion.span
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="inline-block mr-2"
                                      >
                                        ✅
                                      </motion.span>
                                    )}
                                    {todo.text}
                                  </motion.label>
                                  <div className="flex gap-2 ml-4">
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => startEditing(todo)}
                                        disabled={todo.completed}
                                        className="h-10 w-10 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteTodo(todo.id)}
                                        className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </motion.div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <motion.div
                            className="text-sm text-gray-500 mt-4 ml-10 flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                            Created:{" "}
                            {new Date(todo.createdAt).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </motion.div>
                        </CardContent>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Progress Summary */}
          {todos.length > 0 && (
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="glass-card p-8 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl bg-white/10 max-w-2xl mx-auto">
                <motion.div
                  animate={
                    completedCount === totalCount && totalCount > 0
                      ? {
                          scale: [1, 1.05, 1],
                          rotate: [0, 1, -1, 0],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {completedCount === totalCount && totalCount > 0 ? (
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                        Congratulations, Champion!
                      </h3>
                      <p className="text-lg text-gray-600">
                        You've conquered all your tasks! Time to celebrate your amazing productivity! 🌟
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-4">⚡</div>
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Keep Going Strong!
                      </h3>
                      <p className="text-lg text-gray-600">
                        {totalCount - completedCount} task{totalCount - completedCount !== 1 ? "s" : ""} remaining -
                        You've got this! 💪
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
