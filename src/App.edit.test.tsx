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

    it('opens edit modal with task data when Edit is clicked', async () => {
        render(<App />);

        const titleCell = await screen.findByText('Old title');
        const row = titleCell.closest('tr');
        expect(row).not.toBeNull();

        if (!row) {
            throw new Error('Task row not found');
        }

        fireEvent.click(within(row).getByRole('button', { name: /edit/i }));

        // Verify modal is open with correct heading
        expect(screen.getByRole('heading', { name: /edit todo/i })).toBeInTheDocument();

        // Verify modal inputs have the task data
        const inputs = screen.getAllByDisplayValue('Old title');
        expect(inputs.length).toBeGreaterThan(0);

        const descriptions = screen.getAllByDisplayValue('Old description');
        expect(descriptions.length).toBeGreaterThan(0);
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

        // Update the values in the modal inputs
        const titleInputs = screen.getAllByDisplayValue('Old title');
        fireEvent.change(titleInputs[0], { target: { value: 'Updated title' } });

        const descInputs = screen.getAllByDisplayValue('Old description');
        fireEvent.change(descInputs[0], { target: { value: 'Updated description' } });

        // Click Save button in the modal
        const saveButtons = screen.getAllByRole('button', { name: /save/i });
        fireEvent.click(saveButtons[saveButtons.length - 1]); // Last Save button is in the modal

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

    it('marks task as completed when checkbox is toggled in modal', async () => {
        render(<App />);

        const titleCell = await screen.findByText('Old title');
        const row = titleCell.closest('tr');
        expect(row).not.toBeNull();

        if (!row) {
            throw new Error('Task row not found');
        }

        fireEvent.click(within(row).getByRole('button', { name: /edit/i }));

        // Find and click the Completed checkbox in the modal
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[checkboxes.length - 1]); // Last checkbox is in the modal

        // Click Save button in the modal
        const saveButtons = screen.getAllByRole('button', { name: /save/i });
        fireEvent.click(saveButtons[saveButtons.length - 1]);

        await waitFor(() => {
            const persisted = JSON.parse(localStorage.getItem('todo_tasks') ?? '[]') as Array<{
                id: string;
                completed: boolean;
            }>;
            expect(persisted).toHaveLength(1);
            expect(persisted[0]?.completed).toBe(true);
        });
    });
});
