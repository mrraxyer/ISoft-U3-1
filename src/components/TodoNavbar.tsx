import { type JSX } from 'react';
import { type FilterType } from '../types';

type TodoNavbarProps = {
    filterType: FilterType;
    words: string;
    onFilterTypeChange: (value: FilterType) => void;
    onWordsChange: (value: string) => void;
    onSearch: () => void;
};

export default function TodoNavbar({
    filterType,
    words,
    onFilterTypeChange,
    onWordsChange,
    onSearch,
}: TodoNavbarProps): JSX.Element {
    return (
        <nav className="sticky top-0 z-40 border-b border-zinc-700 bg-zinc-950/80 px-4 py-3 backdrop-blur sm:px-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold tracking-tight">JS Todo List</h1>
                    <span className="text-sm text-zinc-400">Home</span>
                </div>

                <form
                    className="flex flex-wrap items-center gap-2 lg:justify-end"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSearch();
                    }}
                >
                    <span className="mr-1 text-sm font-semibold text-cyan-400">Filters</span>

                    <label className="flex items-center gap-1 text-sm">
                        <input
                            type="radio"
                            name="type"
                            checked={filterType === 'all'}
                            onChange={() => onFilterTypeChange('all')}
                            className="accent-cyan-500"
                        />
                        All
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                        <input
                            type="radio"
                            name="type"
                            checked={filterType === 'completed'}
                            onChange={() => onFilterTypeChange('completed')}
                            className="accent-cyan-500"
                        />
                        Completed
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                        <input
                            type="radio"
                            name="type"
                            checked={filterType === 'uncompleted'}
                            onChange={() => onFilterTypeChange('uncompleted')}
                            className="accent-cyan-500"
                        />
                        Uncompleted
                    </label>

                    <input
                        type="search"
                        value={words}
                        onChange={(e) => onWordsChange(e.target.value)}
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
    );
}
