import { useEffect, useMemo, useState, type FormEvent, type JSX } from 'react';
import AlertBanner from './components/AlertBanner';
import EditTodoModal from './components/EditTodoModal';
import TodoForm from './components/TodoForm';
import TodoNavbar from './components/TodoNavbar';
import TodoTable from './components/TodoTable';
import { type FilterType, type ModalState, type Task } from './types';

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
          onSubmit={handleAdd}
        />

        <TodoTable
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </main>

      <EditTodoModal
        modal={modal}
        modalAlert={modalAlert}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        onChange={setModal}
      />
    </div>
  );
}