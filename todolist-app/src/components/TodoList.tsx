import { Todo } from '../stores/todoStore';
import TodoItem from './TodoItem';

type TodoListProps = {
    todos: Todo[];
};

const TodoList = ({ todos }: TodoListProps) => {
    if (todos.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                Aucune tâche à afficher.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {todos.map((todo) => (
                <TodoItem key={todo._id} todo={todo} />
            ))}
        </div>
    );
};

export default TodoList;
