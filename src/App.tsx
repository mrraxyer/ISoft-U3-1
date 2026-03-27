import React, { useState, useEffect, type JSX } from 'react';
import Navbar from './components/Navbar';
import { type Task } from './types';

/**
 * Main application component handling the ToDo list CRUD operations.
 *
 * @returns {JSX.Element} The rendered application component.
 */
export default function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  /**
   * Loads tasks from localStorage when the component mounts.
   */
  useEffect(() => {
    const savedTasks = localStorage.getItem('todo_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  /**
   * Saves tasks to localStorage whenever the tasks array changes.
   */
  useEffect(() => {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  /**
   * Handles adding a new task or updating an existing one.
   *
   * @param {React.FormEvent} e - The form submission event.
   * @returns {void}
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      const updatedTasks = tasks.map(task =>
        task.id === editingId ? { ...task, title, description } : task
      );
      setTasks(updatedTasks);
      setEditingId(null);
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }

    setTitle('');
    setDescription('');
  };

  /**
   * Toggles the completion status of a specific task.
   *
   * @param {string} id - The unique identifier of the task.
   * @returns {void}
   */
  const handleToggleComplete = (id: string): void => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  /**
   * Removes a task from the list.
   *
   * @param {string} id - The unique identifier of the task to delete.
   * @returns {void}
   */
  const handleDelete = (id: string): void => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
  };

  /**
   * Populates the input fields with the task data for editing.
   *
   * @param {Task} task - The task object to edit.
   * @returns {void}
   */
  const handleEdit = (task: Task): void => {
    setTitle(task.title);
    setDescription(task.description);
    setEditingId(task.id);
  };

  return (
    <div className="min-h-screen bg-zinc-800 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto mt-10 p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 items-center bg-zinc-900 p-4 rounded-md mb-8"
        >
          <div className="flex items-center gap-2 w-full">
            <label className="font-semibold text-sm">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="flex-1 bg-white text-black px-3 py-1.5 rounded-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full">
            <label className="font-semibold text-sm">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="flex-1 bg-white text-black px-3 py-1.5 rounded-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-sm transition-colors whitespace-nowrap"
          >
            {editingId ? 'Update' : 'Add'}
          </button>
        </form>

        <div className="bg-zinc-900 rounded-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-900 text-sm">
                <th className="p-4 font-semibold">Todo</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Completed</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-zinc-500">
                    No tasks available.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className={`p-4 ${task.completed ? 'line-through text-zinc-500' : ''}`}>
                      {task.title}
                    </td>
                    <td className={`p-4 ${task.completed ? 'line-through text-zinc-500' : ''}`}>
                      {task.description}
                    </td>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.id)}
                        className="w-5 h-5 cursor-pointer accent-blue-600"
                      />
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="bg-blue-600 hover:bg-blue-700 p-2 rounded-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded-sm"
                      >
                        Del
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}