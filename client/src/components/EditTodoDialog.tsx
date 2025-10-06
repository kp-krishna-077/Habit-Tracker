import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { priorityLevels, todoCategories } from "@shared/schema";
import type { Todo } from "@shared/schema";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  priority: z.enum(priorityLevels),
  category: z.string().min(1, "Category is required"),
});

type FormData = z.infer<typeof formSchema>;

interface EditTodoDialogProps {
  todo: Todo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export function EditTodoDialog({ todo, open, onOpenChange, onUpdate }: EditTodoDialogProps) {
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    if (todo) {
      const isCustomCategory = !todoCategories.includes(todo.category as any);
      
      reset({
        title: todo.title,
        description: todo.description || "",
        dueDate: todo.dueDate || "",
        dueTime: todo.dueTime || "",
        priority: todo.priority,
        category: isCustomCategory ? "custom" : todo.category,
      });

      if (isCustomCategory) {
        setShowCustomCategory(true);
        setCustomCategory(todo.category);
      } else {
        setShowCustomCategory(false);
        setCustomCategory("");
      }
    }
  }, [todo, reset]);

  const onSubmit = (data: FormData) => {
    if (!todo) return;

    const category = showCustomCategory ? customCategory : data.category;
    onUpdate(todo.id, {
      ...data,
      category,
    });
    onOpenChange(false);
  };

  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setShowCustomCategory(true);
      setValue("category", "");
    } else {
      setShowCustomCategory(false);
      setValue("category", value);
    }
  };

  if (!todo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update your task details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              placeholder="e.g., Buy groceries"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="e.g., Milk, eggs, bread"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                type="date"
                {...register("dueDate")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dueTime">Due Time</Label>
              <Input
                id="edit-dueTime"
                type="time"
                {...register("dueTime")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-priority">Priority</Label>
            <Select
              onValueChange={(value) => setValue("priority", value as any)}
              value={watch("priority")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category *</Label>
            <Select
              onValueChange={handleCategoryChange}
              value={showCustomCategory ? "custom" : watch("category")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {todoCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom...</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          {showCustomCategory && (
            <div className="space-y-2">
              <Label htmlFor="edit-customCategory">Custom Category *</Label>
              <Input
                id="edit-customCategory"
                placeholder="e.g., Health, Finance"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  setValue("category", e.target.value);
                }}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
