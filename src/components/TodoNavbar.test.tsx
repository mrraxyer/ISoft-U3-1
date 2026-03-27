import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TodoNavbar from './TodoNavbar';

describe('TodoNavbar', () => {
    it('renders "JS Todo List" and "Home" texts', () => {
        render(
            <TodoNavbar
                filterType="all"
                words=""
                onFilterTypeChange={() => { }}
                onWordsChange={() => { }}
            />,
        );

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: /js todo list/i,
            }),
        ).toBeInTheDocument();

        expect(screen.getByText(/home/i)).toBeInTheDocument();
    });
});
