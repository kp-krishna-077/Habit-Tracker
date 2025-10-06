import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <div className="flex gap-2 mb-4">
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Add a new task"
          onKeyPress={e => e.key === 'Enter' && addTodo()}
        />
        <Button onClick={addTodo}>Add</Button>
      </div>
      <ul>
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex items-center gap-2 p-2 border-b"
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
            />
            <span
              className={`flex-1 ${
                todo.completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {todo.text}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;
