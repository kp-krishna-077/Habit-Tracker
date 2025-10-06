import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddTodoDialog } from "@/components/AddTodoDialog";
import { EditTodoDialog } from "@/components/EditTodoDialog";
import { TodoCard } from "@/components/TodoCard";
import { storageService } from "@/lib/storage";
import type { Todo, InsertTodo } from "@shared/schema";
import { Calendar, ListTodo } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfDay, endOfDay, parseISO } from "date-fns";

type ViewMode = "list" | "daily" | "weekly";
type FilterPriority = "All" | "High" | "Medium" | "Low";
type FilterCategory = "All" | string;

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("All");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("All");

  useEffect(() => {
    const loadTodos = async () => {
      const savedTodos = await storageService.getTodos();
      setTodos(savedTodos);
    };
    loadTodos();
  }, []);

  const saveTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    storageService.saveTodos(newTodos);
  };

  const handleAddTodo = (insertTodo: InsertTodo) => {
    const newTodo: Todo = {
      ...insertTodo,
      id: nanoid(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    saveTodos([...todos, newTodo]);
  };

  const handleToggleComplete = (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : undefined,
          }
        : todo
    );
    saveTodos(updatedTodos);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setEditDialogOpen(true);
  };

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    saveTodos(updatedTodos);
  };

  const handleDeleteTodo = (id: string) => {
    saveTodos(todos.filter((todo) => todo.id !== id));
  };

  const filterTodos = (todoList: Todo[]) => {
    return todoList.filter((todo) => {
      const matchesPriority = filterPriority === "All" || todo.priority === filterPriority;
      const matchesCategory = filterCategory === "All" || todo.category === filterCategory;
      return matchesPriority && matchesCategory;
    });
  };

  const activeTodos = filterTodos(todos.filter((todo) => !todo.completed));
  const completedTodos = filterTodos(todos.filter((todo) => todo.completed));

  const getTodosForDate = (date: Date, todoList: Todo[]) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return todoList.filter((todo) => todo.dueDate === dateStr);
  };

  const getTodosForWeek = (todoList: Todo[]) => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

    return todoList.filter((todo) => {
      if (!todo.dueDate) return false;
      const dueDate = parseISO(todo.dueDate);
      return dueDate >= weekStart && dueDate <= weekEnd;
    });
  };

  const uniqueCategories = Array.from(new Set(todos.map((t) => t.category)));

  const renderDailyView = () => {
    const today = new Date();
    const todayTodos = getTodosForDate(today, activeTodos);
    const todayCompleted = getTodosForDate(today, completedTodos);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Today - {format(today, "MMMM d, yyyy")}</h2>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Due Today ({todayTodos.length})</h3>
          {todayTodos.length === 0 ? (
            <p className="text-muted-foreground">No tasks due today</p>
          ) : (
            <div className="space-y-2">
              {todayTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          )}
        </div>

        {todayCompleted.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Completed Today ({todayCompleted.length})</h3>
            <div className="space-y-2">
              {todayCompleted.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWeeklyView = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
    const weekTodos = getTodosForWeek(activeTodos);
    const weekCompleted = getTodosForWeek(completedTodos);

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Week of {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </h2>
        </div>

        <div className="grid gap-4">
          {days.map((day) => {
            const dayTodos = getTodosForDate(day, activeTodos);
            const dayCompleted = getTodosForDate(day, completedTodos);
            const isToday = format(day, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

            return (
              <div key={day.toISOString()} className={`border rounded-lg p-4 ${isToday ? "border-primary bg-primary/5" : ""}`}>
                <h3 className="font-semibold mb-3">
                  {format(day, "EEEE, MMM d")}
                  {isToday && <span className="ml-2 text-primary text-sm">(Today)</span>}
                </h3>
                
                {dayTodos.length === 0 && dayCompleted.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tasks scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {dayTodos.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTodo}
                        onDelete={handleDeleteTodo}
                      />
                    ))}
                    {dayCompleted.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTodo}
                        onDelete={handleDeleteTodo}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">To-Do List</h1>
        <AddTodoDialog onAdd={handleAddTodo} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
          >
            <ListTodo className="h-4 w-4" />
            List
          </button>
          <button
            onClick={() => setViewMode("daily")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              viewMode === "daily" ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Daily
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              viewMode === "weekly" ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Weekly
          </button>
        </div>

        <div className="flex gap-2 flex-1">
          <Select value={filterPriority} onValueChange={(value: FilterPriority) => setFilterPriority(value)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "list" ? (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active ({activeTodos.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTodos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {activeTodos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No active tasks</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add a new task to get started
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTodos.map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedTodos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No completed tasks</p>
              </div>
            ) : (
              <div className="space-y-2">
                {completedTodos.map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : viewMode === "daily" ? (
        renderDailyView()
      ) : (
        renderWeeklyView()
      )}

      <EditTodoDialog
        todo={editingTodo}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleUpdateTodo}
      />
    </div>
  );
};

export default TodoPage;
