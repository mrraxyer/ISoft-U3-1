import { type FilterType, type Task } from '../types';

export function filterTasks(tasks: Task[], filterType: FilterType, words: string): Task[] {
    const search = words.trim().toLowerCase();

    return tasks.filter((task) => {
        const wordsOk =
            search.length === 0 ||
            task.title.toLowerCase().includes(search) ||
            task.description.toLowerCase().includes(search);

        const completedOk =
            filterType === 'all' ||
            (filterType === 'completed' && task.completed) ||
            (filterType === 'uncompleted' && !task.completed);

        return wordsOk && completedOk;
    });
}
