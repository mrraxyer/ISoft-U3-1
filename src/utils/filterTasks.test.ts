import { describe, expect, it } from 'vitest';
import { filterTasks } from './filterTasks';

const baseTasks = [
    {
        id: '1',
        title: 'Done task',
        description: 'Already completed',
        completed: true,
    },
    {
        id: '2',
        title: 'Pending task',
        description: 'Still open',
        completed: false,
    },
];

describe('filterTasks', () => {
    it('returns only completed tasks when filterType is completed', () => {
        const result = filterTasks(baseTasks, 'completed', '');

        expect(result).toHaveLength(1);
        expect(result[0]?.id).toBe('1');
    });

    it('returns only uncompleted tasks when filterType is uncompleted', () => {
        const result = filterTasks(baseTasks, 'uncompleted', '');

        expect(result).toHaveLength(1);
        expect(result[0]?.id).toBe('2');
    });

    it('combines status filter with search words', () => {
        const result = filterTasks(baseTasks, 'all', 'pending');

        expect(result).toHaveLength(1);
        expect(result[0]?.id).toBe('2');
    });
});
