import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('US6 - Edit Existing Tasks', () => {
    beforeEach(() => {
        localStorage.setItem(
            'todo_tasks',
            JSON.stringify([
                {
                    id: 'task-1',
                    title: 'Old title',
                    description: 'Old description',
                    completed: false,
                },
            ]),
        );
    });

    it('loads selected task data into top input fields when Edit is clicked', async () => {
        render(<App />);

        const titleCell = await screen.findByText('Old title');
        const row = titleCell.closest('tr');
        expect(row).not.toBeNull();

        if (!row) {
            throw new Error('Task row not found');
        }

        fireEvent.click(within(row).getByRole('button', { name: /edit/i }));

        expect(screen.getByLabelText(/title/i)).toHaveValue('Old title');
        expect(screen.getByLabelText(/description/i)).toHaveValue('Old description');
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('updates screen list and localStorage after saving edited task', async () => {
        render(<App />);

        const titleCell = await screen.findByText('Old title');
        const row = titleCell.closest('tr');
        expect(row).not.toBeNull();

        if (!row) {
            throw new Error('Task row not found');
        }

        fireEvent.click(within(row).getByRole('button', { name: /edit/i }));

        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated title' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Updated description' } });
        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
            expect(screen.getByText('Updated title')).toBeInTheDocument();
            expect(screen.getByText('Updated description')).toBeInTheDocument();
            expect(screen.queryByText('Old title')).not.toBeInTheDocument();
        });

        await waitFor(() => {
            const persisted = JSON.parse(localStorage.getItem('todo_tasks') ?? '[]') as Array<{
                id: string;
                title: string;
                description: string;
            }>;
            expect(persisted).toHaveLength(1);
            expect(persisted[0]?.id).toBe('task-1');
            expect(persisted[0]?.title).toBe('Updated title');
            expect(persisted[0]?.description).toBe('Updated description');
        });
    });
});
