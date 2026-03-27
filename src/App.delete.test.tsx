import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('US5 - Delete Tasks', () => {
    beforeEach(() => {
        localStorage.setItem(
            'todo_tasks',
            JSON.stringify([
                {
                    id: 'task-1',
                    title: 'Task to keep',
                    description: 'Must remain',
                    completed: false,
                },
                {
                    id: 'task-2',
                    title: 'Task to delete',
                    description: 'Must disappear',
                    completed: false,
                },
            ]),
        );
    });

    it('removes the selected task from the list when Delete is clicked', async () => {
        render(<App />);

        const titleCell = await screen.findByText('Task to delete');
        const row = titleCell.closest('tr');
        expect(row).not.toBeNull();

        if (!row) {
            throw new Error('Task row not found');
        }

        fireEvent.click(within(row).getByRole('button', { name: /delete/i }));

        await waitFor(() => {
            expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Task to keep')).toBeInTheDocument();
    });

    it('updates localStorage filtering out the deleted task', async () => {
        render(<App />);

        const titleCell = await screen.findByText('Task to delete');
        const row = titleCell.closest('tr');
        expect(row).not.toBeNull();

        if (!row) {
            throw new Error('Task row not found');
        }

        fireEvent.click(within(row).getByRole('button', { name: /delete/i }));

        await waitFor(() => {
            const persisted = JSON.parse(localStorage.getItem('todo_tasks') ?? '[]') as Array<{ id: string; title: string }>;
            expect(persisted).toHaveLength(1);
            expect(persisted[0]?.id).toBe('task-1');
            expect(persisted.some((task) => task.id === 'task-2')).toBe(false);
        });
    });
});
