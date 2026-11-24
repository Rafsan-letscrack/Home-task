import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"

import Navbar from "@/components/Navbar"
import Home from "@/pages/Home"
import NewTask from "@/pages/NewTask"
import TaskDetail from "@/pages/TaskDetail"
import NotFound from "@/pages/NotFound"

const STORAGE_KEY = "task-manager:tasks"

// Read saved tasks from localStorage (runs only once, on first render)
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export default function App() {
  // useState: the single source of truth for all tasks
  const [tasks, setTasks] = useState(loadTasks)

  // useEffect: save tasks to localStorage every time they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = (data) =>
    setTasks((prev) => [
      { id: crypto.randomUUID(), done: false, createdAt: Date.now(), ...data },
      ...prev,
    ])

  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const updateTask = (id, changes) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)))

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id))

  const pendingCount = tasks.filter((t) => !t.done).length

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar pendingCount={pendingCount} />
      <main className="mx-auto max-w-2xl p-4">
        <Routes>
          <Route
            path="/"
            element={<Home tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />}
          />
          <Route path="/new" element={<NewTask addTask={addTask} />} />
          <Route
            path="/task/:id"
            element={
              <TaskDetail
                tasks={tasks}
                toggleTask={toggleTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
