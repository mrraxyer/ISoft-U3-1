import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('US2 - Add and List Tasks', () => {
    beforeEach(() => {
        localStorage.setItem('todo_tasks', JSON.stringify([]));
    });

    it('shows Title and Description fields with Add button', () => {
        render(<App />);

        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('adds a task to the table and renders checkbox and action buttons', async () => {
        render(<App />);

        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Buy milk' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: '2 liters' } });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        const titleCell = await screen.findByText('Buy milk');
        const row = titleCell.closest('tr');
        expect(row).not.toBeNull();

        if (!row) {
            throw new Error('Task row not found');
        }

        expect(within(row).getByText('2 liters')).toBeInTheDocument();
        expect(within(row).getByRole('checkbox')).toBeInTheDocument();
        expect(within(row).getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(within(row).getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('updates persisted task list after submitting the form', async () => {
        render(<App />);

        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Read book' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Clean Code chapter 1' } });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            const persisted = localStorage.getItem('todo_tasks');
            expect(persisted).toBeTruthy();

            const parsed = JSON.parse(persisted ?? '[]') as Array<{ title: string; description: string }>;
            expect(parsed.some((task) => task.title === 'Read book' && task.description === 'Clean Code chapter 1')).toBe(true);
        });
    });
});
