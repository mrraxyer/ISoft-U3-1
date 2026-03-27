import { useEffect, useMemo, useState, type FormEvent, type JSX } from 'react';
import AlertBanner from './components/AlertBanner';
import TodoForm from './components/TodoForm';
import TodoNavbar from './components/TodoNavbar';
import TodoTable from './components/TodoTable';
import { type FilterType, type Task } from './types';

export default function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [words, setWords] = useState('');
  const [mainAlert, setMainAlert] = useState('');

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
      setIsHydrated(true);
      return;
    }

    try {
      setTasks(JSON.parse(savedTasks));
    } catch {
      setTasks([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks, isHydrated]);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setMainAlert('Title and description are required');
      return;
    }

    setMainAlert('');

    if (editingId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingId
            ? {
              ...task,
              title: title.trim(),
              description: description.trim(),
            }
            : task,
        ),
      );
      setEditingId(null);
    } else {
      setTasks((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          title: title.trim(),
          description: description.trim(),
          completed: false,
        },
      ]);
    }

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

  const handleEdit = (task: Task): void => {
    setMainAlert('');
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <TodoNavbar
        filterType={filterType}
        words={words}
        onFilterTypeChange={setFilterType}
        onWordsChange={setWords}
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <AlertBanner message={mainAlert} className="mb-4" />

        <TodoForm
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onSubmit={handleSubmit}
          submitLabel={editingId ? 'Save' : 'Add'}
        />

        <TodoTable
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}