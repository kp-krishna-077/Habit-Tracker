import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Edit2, Trash2 } from "lucide-react";
import type { Todo } from "@shared/schema";
import { format } from "date-fns";

interface TodoCardProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  High: "bg-red-500 text-white hover:bg-red-600",
  Medium: "bg-yellow-500 text-white hover:bg-yellow-600",
  Low: "bg-green-500 text-white hover:bg-green-600",
};

export function TodoCard({ todo, onToggleComplete, onEdit, onDelete }: TodoCardProps) {
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <Card className={`${todo.completed ? "opacity-60" : ""} ${isOverdue ? "border-red-500" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggleComplete(todo.id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className={`font-semibold ${
                  todo.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {todo.title}
              </h3>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(todo)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {todo.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {todo.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <Badge className={priorityColors[todo.priority]}>
                {todo.priority}
              </Badge>
              
              <Badge variant="outline">{todo.category}</Badge>

              {todo.dueDate && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className={isOverdue ? "text-red-500 font-semibold" : ""}>
                    {format(new Date(todo.dueDate), "MMM d, yyyy")}
                  </span>
                </div>
              )}

              {todo.dueTime && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{todo.dueTime}</span>
                </div>
              )}
            </div>

            {todo.completedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Completed on {format(new Date(todo.completedAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
