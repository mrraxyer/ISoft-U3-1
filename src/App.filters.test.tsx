import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('US7 - Status Filters', () => {
    beforeEach(() => {
        localStorage.setItem(
            'todo_tasks',
            JSON.stringify([
                {
                    id: 'done-1',
                    title: 'Completed task',
                    description: 'Finished item',
                    completed: true,
                },
                {
                    id: 'pending-1',
                    title: 'Pending task',
                    description: 'Open item',
                    completed: false,
                },
            ]),
        );
    });

    it('shows only completed tasks when Completed filter is selected', async () => {
        render(<App />);

        await screen.findByText('Completed task');
        fireEvent.click(screen.getByLabelText(/^completed$/i));
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => {
            expect(screen.getByText('Completed task')).toBeInTheDocument();
            expect(screen.queryByText('Pending task')).not.toBeInTheDocument();
        });
    });

    it('shows only uncompleted tasks when Uncompleted filter is selected', async () => {
        render(<App />);

        await screen.findByText('Pending task');
        fireEvent.click(screen.getByLabelText(/^uncompleted$/i));
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => {
            expect(screen.getByText('Pending task')).toBeInTheDocument();
            expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
        });
    });

    it('does not apply filter changes until Search is clicked', async () => {
        render(<App />);

        await screen.findByText('Completed task');
        fireEvent.click(screen.getByLabelText(/^completed$/i));

        expect(screen.getByText('Completed task')).toBeInTheDocument();
        expect(screen.getByText('Pending task')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => {
            expect(screen.getByText('Completed task')).toBeInTheDocument();
            expect(screen.queryByText('Pending task')).not.toBeInTheDocument();
        });
    });
});
