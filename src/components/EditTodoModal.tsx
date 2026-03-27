import { type JSX } from 'react';
import { type ModalState } from '../types';
import AlertBanner from './AlertBanner';

type EditTodoModalProps = {
    modal: ModalState;
    modalAlert: string;
    onClose: () => void;
    onSave: () => void;
    onChange: (next: ModalState) => void;
};

export default function EditTodoModal({
    modal,
    modalAlert,
    onClose,
    onSave,
    onChange,
}: EditTodoModalProps): JSX.Element | null {
    if (!modal.isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-lg rounded-lg border border-zinc-700 bg-zinc-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-700 px-5 py-4">
                    <h2 className="text-lg font-semibold">Edit Todo</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl leading-none text-zinc-400 transition hover:text-zinc-200"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-4 px-5 py-4">
                    <AlertBanner message={modalAlert} />

                    <div>
                        <label className="mb-1 block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            value={modal.title}
                            onChange={(e) => onChange({ ...modal, title: e.target.value })}
                            className="h-10 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 outline-none ring-cyan-500 focus:ring-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Description</label>
                        <textarea
                            value={modal.description}
                            onChange={(e) => onChange({ ...modal, description: e.target.value })}
                            rows={3}
                            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 outline-none ring-cyan-500 focus:ring-2"
                        />
                    </div>

                    <label className="inline-flex items-center gap-2 text-sm">
                        <span>Completed</span>
                        <input
                            type="checkbox"
                            checked={modal.completed}
                            onChange={(e) => onChange({ ...modal, completed: e.target.checked })}
                            className="h-4 w-4 accent-cyan-500"
                        />
                    </label>
                </div>

                <div className="flex justify-end gap-2 border-t border-zinc-700 px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-zinc-500 px-4 py-2 text-sm font-medium transition hover:bg-zinc-800"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
