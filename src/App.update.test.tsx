import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('US4 - Task State Update', () => {
    beforeEach(() => {
        localStorage.setItem(
            'todo_tasks',
            JSON.stringify([
                {
                    id: 'task-1',
                    title: 'Toggle me',
                    description: 'Checkbox test',
                    completed: false,
                },
            ]),
        );
    });

    it('toggles completed state from false to true and then back to false', async () => {
        render(<App />);

        const titleCell = await screen.findByText('Toggle me');
        const row = titleCell.closest('tr');
        expect(row).not.toBeNull();

        if (!row) {
            throw new Error('Task row not found');
        }

        const checkbox = within(row).getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
        expect(titleCell).not.toHaveClass('line-through');

        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(checkbox).toBeChecked();
            expect(titleCell).toHaveClass('line-through');

            const persisted = JSON.parse(localStorage.getItem('todo_tasks') ?? '[]') as Array<{
                id: string;
                completed: boolean;
            }>;
            const task = persisted.find((item) => item.id === 'task-1');
            expect(task?.completed).toBe(true);
        });

        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(checkbox).not.toBeChecked();
            expect(titleCell).not.toHaveClass('line-through');

            const persisted = JSON.parse(localStorage.getItem('todo_tasks') ?? '[]') as Array<{
                id: string;
                completed: boolean;
            }>;
            const task = persisted.find((item) => item.id === 'task-1');
            expect(task?.completed).toBe(false);
        });
    });
});
