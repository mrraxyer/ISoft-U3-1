import { useEffect, useMemo, useState, type FormEvent, type JSX } from 'react';
import AlertBanner from './components/AlertBanner';
import EditTodoModal from './components/EditTodoModal';
import TodoForm from './components/TodoForm';
import TodoNavbar from './components/TodoNavbar';
import TodoTable from './components/TodoTable';
import { type FilterType, type ModalState, type Task } from './types';
import { filterTasks } from './utils/filterTasks';

export default function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pendingFilterType, setPendingFilterType] = useState<FilterType>('all');
  const [pendingWords, setPendingWords] = useState('');
  const [appliedFilterType, setAppliedFilterType] = useState<FilterType>('all');
  const [appliedWords, setAppliedWords] = useState('');
  const [mainAlert, setMainAlert] = useState('');
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    id: '',
    title: '',
    description: '',
    completed: false,
  });
  const [modalAlert, setModalAlert] = useState('');

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
    return filterTasks(tasks, appliedFilterType, appliedWords);
  }, [tasks, appliedWords, appliedFilterType]);

  const handleApplyFilters = (): void => {
    setAppliedFilterType(pendingFilterType);
    setAppliedWords(pendingWords);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
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

  const handleEdit = (task: Task): void => {
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
    setModal({
      isOpen: false,
      id: '',
      title: '',
      description: '',
      completed: false,
    });
    setModalAlert('');
  };

  const handleChangeModal = (next: ModalState): void => {
    setModal(next);
  };

  const handleSaveModal = (): void => {
    if (!modal.title.trim() || !modal.description.trim()) {
      setModalAlert('Title and description are required');
      return;
    }

    setModalAlert('');
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
        filterType={pendingFilterType}
        words={pendingWords}
        onFilterTypeChange={setPendingFilterType}
        onWordsChange={setPendingWords}
        onSearch={handleApplyFilters}
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <AlertBanner message={mainAlert} className="mb-4" />

        <TodoForm
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onSubmit={handleSubmit}
          submitLabel="Add"
        />

        <TodoTable
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <EditTodoModal
        modal={modal}
        modalAlert={modalAlert}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        onChange={handleChangeModal}
      />
    </div>
  );
}