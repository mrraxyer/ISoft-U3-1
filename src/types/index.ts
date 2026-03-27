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