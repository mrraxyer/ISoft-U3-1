import { type JSX } from 'react';

/**
 * Navigation bar component for the application.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
export default function Navbar(): JSX.Element {
    return (
        <nav className="flex items-center justify-between bg-zinc-900 px-6 py-4 text-white border-b border-zinc-700">
            <div className="flex items-center gap-6">
                <h1 className="text-xl font-bold">JS Todo List</h1>
                <button className="hover:text-gray-300">Home</button>
            </div>
        </nav>
    );
}