import { type FormEvent, type JSX } from 'react';

type TodoFormProps = {
    title: string;
    description: string;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    submitLabel?: string;
};

export default function TodoForm({
    title,
    description,
    onTitleChange,
    onDescriptionChange,
    onSubmit,
    submitLabel = 'Add',
}: TodoFormProps): JSX.Element {
    return (
        <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-700 bg-zinc-950 p-4 sm:grid-cols-12 sm:items-end">
                <div className="sm:col-span-3">
                    <label htmlFor="todo-title" className="mb-1 block text-sm font-medium">Title</label>
                    <input
                        id="todo-title"
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="Learn JS"
                        className="h-10 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 outline-none ring-cyan-500 placeholder:text-zinc-500 focus:ring-2"
                    />
                </div>

                <div className="sm:col-span-7">
                    <label htmlFor="todo-description" className="mb-1 block text-sm font-medium">Description</label>
                    <input
                        id="todo-description"
                        type="text"
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        placeholder="Watch JS Tutorials"
                        className="h-10 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 outline-none ring-cyan-500 placeholder:text-zinc-500 focus:ring-2"
                    />
                </div>

                <div className="sm:col-span-2">
                    <button
                        type="submit"
                        className="h-10 w-full rounded-md bg-cyan-600 px-4 font-semibold text-white transition hover:bg-cyan-500"
                    >
                        {submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
}
