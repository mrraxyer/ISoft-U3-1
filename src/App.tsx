import { useEffect, useMemo, useState, type FormEvent, type JSX } from 'react';
import { type Task } from './types';

type FilterType = 'all' | 'completed' | 'uncompleted';

type ModalState = {
  isOpen: boolean;
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

const initialModal: ModalState = {
  isOpen: false,
  id: '',
  title: '',
  description: '',
  completed: false,
};

export default function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [words, setWords] = useState('');
  const [mainAlert, setMainAlert] = useState('');
  const [modalAlert, setModalAlert] = useState('');
  const [modal, setModal] = useState<ModalState>(initialModal);

  useEffect(() => {
    const savedTasks = localStorage.getItem('todo_tasks');
    if (!savedTasks) {
      setTasks([
        {
          id: crypto.randomUUID(),
          title: 'Learn JS',
          description: 'Watch JS Tutorials',
          completed: false,
        },
      ]);
      return;
    }

    try {
      setTasks(JSON.parse(savedTasks));
    } catch {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const search = words.trim().toLowerCase();
      const wordsOk =
        search.length === 0 ||
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search);

      const completedOk =
        filterType === 'all' ||
        (filterType === 'completed' && task.completed) ||
        (filterType === 'uncompleted' && !task.completed);

      return wordsOk && completedOk;
    });
  }, [tasks, words, filterType]);

  const handleAdd = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setMainAlert('Title and description are required');
      return;
    }

    setMainAlert('');
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
      },
    ]);
    setTitle('');
    setDescription('');
  };

  const handleToggleComplete = (id: string): void => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  };

  const handleDelete = (id: string): void => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleOpenModal = (task: Task): void => {
    setModalAlert('');
    setModal({
      isOpen: true,
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
    });
  };

  const handleCloseModal = (): void => {
    setModalAlert('');
    setModal(initialModal);
  };

  const handleSaveModal = (): void => {
    if (!modal.title.trim() || !modal.description.trim()) {
      setModalAlert('Title and description are required');
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === modal.id
          ? {
            ...task,
            title: modal.title.trim(),
            description: modal.description.trim(),
            completed: modal.completed,
          }
          : task,
      ),
    );

    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <nav className="border-b border-zinc-700 bg-zinc-950/80 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tight">JS Todo List</h1>
            <span className="text-sm text-zinc-400">Home</span>
          </div>

          <form className="flex flex-wrap items-center gap-2 lg:justify-end" onSubmit={(e) => e.preventDefault()}>
            <span className="mr-1 text-sm font-semibold text-cyan-400">Filters</span>

            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="type"
                checked={filterType === 'all'}
                onChange={() => setFilterType('all')}
                className="accent-cyan-500"
              />
              All
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="type"
                checked={filterType === 'completed'}
                onChange={() => setFilterType('completed')}
                className="accent-cyan-500"
              />
              Completed
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="type"
                checked={filterType === 'uncompleted'}
                onChange={() => setFilterType('uncompleted')}
                className="accent-cyan-500"
              />
              Uncompleted
            </label>

            <input
              type="search"
              value={words}
              onChange={(e) => setWords(e.target.value)}
              placeholder="Words"
              className="h-9 rounded-md border border-zinc-600 bg-zinc-800 px-3 text-sm outline-none ring-cyan-500 placeholder:text-zinc-500 focus:ring-2"
            />
            <button
              type="submit"
              className="h-9 rounded-md border border-cyan-500 px-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/15"
            >
              Search
            </button>
          </form>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        {mainAlert && (
          <div className="mb-4 rounded-md border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {mainAlert}
          </div>
        )}

        <form onSubmit={handleAdd}>
          <div className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-700 bg-zinc-950 p-4 sm:grid-cols-12 sm:items-end">
            <div className="sm:col-span-3">
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Learn JS"
                className="h-10 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 outline-none ring-cyan-500 placeholder:text-zinc-500 focus:ring-2"
              />
            </div>

            <div className="sm:col-span-7">
              <label className="mb-1 block text-sm font-medium">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Watch JS Tutorials"
                className="h-10 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 outline-none ring-cyan-500 placeholder:text-zinc-500 focus:ring-2"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="h-10 w-full rounded-md bg-cyan-600 px-4 font-semibold text-white transition hover:bg-cyan-500"
              >
                Add
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-950">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th className="px-4 py-3">Todo</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-center">Completed</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                    No todos match your filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, index) => (
                  <tr key={task.id} className={index % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/70'}>
                    <td className={`px-4 py-3 ${task.completed ? 'text-zinc-500 line-through' : ''}`}>
                      {task.title}
                    </td>
                    <td className={`px-4 py-3 ${task.completed ? 'text-zinc-500 line-through' : ''}`}>
                      {task.description}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.id)}
                        className="h-4 w-4 cursor-pointer accent-cyan-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(task)}
                          className="rounded-md bg-blue-600 px-3 py-1.5 font-medium text-white transition hover:bg-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(task.id)}
                          className="rounded-md bg-red-600 px-3 py-1.5 font-medium text-white transition hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-lg border border-zinc-700 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-4">
              <h2 className="text-lg font-semibold">Edit Todo</h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-2xl leading-none text-zinc-400 transition hover:text-zinc-200"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              {modalAlert && (
                <div className="rounded-md border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {modalAlert}
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={modal.title}
                  onChange={(e) => setModal((prev) => ({ ...prev, title: e.target.value }))}
                  className="h-10 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 outline-none ring-cyan-500 focus:ring-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  value={modal.description}
                  onChange={(e) => setModal((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 outline-none ring-cyan-500 focus:ring-2"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm">
                <span>Completed</span>
                <input
                  type="checkbox"
                  checked={modal.completed}
                  onChange={(e) => setModal((prev) => ({ ...prev, completed: e.target.checked }))}
                  className="h-4 w-4 accent-cyan-500"
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-zinc-700 px-5 py-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-md border border-zinc-500 px-4 py-2 text-sm font-medium transition hover:bg-zinc-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}