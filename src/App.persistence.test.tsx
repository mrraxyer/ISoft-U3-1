import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('US3 - Data Persistence', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('persists tasks in localStorage when a new one is added', async () => {
        render(<App />);

        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Deploy app' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Push to production' } });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            const persisted = localStorage.getItem('todo_tasks');
            expect(persisted).toBeTruthy();

            const parsed = JSON.parse(persisted ?? '[]') as Array<{ title: string; description: string }>;
            expect(parsed.some((task) => task.title === 'Deploy app' && task.description === 'Push to production')).toBe(true);
        });
    });

    it('loads tasks from localStorage on mount and populates the table', async () => {
        localStorage.setItem(
            'todo_tasks',
            JSON.stringify([
                {
                    id: 'persisted-1',
                    title: 'Persisted task',
                    description: 'Loaded from storage',
                    completed: false,
                },
            ]),
        );

        render(<App />);

        expect(await screen.findByText('Persisted task')).toBeInTheDocument();
        expect(screen.getByText('Loaded from storage')).toBeInTheDocument();
    });
});
