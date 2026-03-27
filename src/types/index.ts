/**
 * Represents a single task in the ToDo list.
 *
 * @interface Task
 */
export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

export type FilterType = 'all' | 'completed' | 'uncompleted';

export type ModalState = {
    isOpen: boolean;
    id: string;
    title: string;
    description: string;
    completed: boolean;
};