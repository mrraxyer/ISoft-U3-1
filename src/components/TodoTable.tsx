import { type JSX } from 'react';
import { type Task } from '../types';

type TodoTableProps = {
    tasks: Task[];
    onToggleComplete: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
};

export default function TodoTable({
    tasks,
    onToggleComplete,
    onEdit,
    onDelete,
}: TodoTableProps): JSX.Element {
    return (
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
                    {tasks.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                                No todos match your filters.
                            </td>
                        </tr>
                    ) : (
                        tasks.map((task, index) => (
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
                                        onChange={() => onToggleComplete(task.id)}
                                        className="h-4 w-4 cursor-pointer accent-cyan-500"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(task)}
                                            className="rounded-md bg-blue-600 px-3 py-1.5 font-medium text-white transition hover:bg-blue-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(task.id)}
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
    );
}
