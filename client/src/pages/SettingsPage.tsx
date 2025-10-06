import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, Download, Upload, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { storageService } from "@/lib/storage";
import { exportHabitsToPDF } from "@/lib/pdfExport";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      storageService.saveTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      storageService.saveTheme("light");
    }
  };

  const exportData = async () => {
    const data = {
      habits: await storageService.getHabits(),
      completions: await storageService.getCompletions(),
      achievements: await storageService.getAchievements(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Your data has been exported successfully.",
    });
  };

  const exportPDF = async () => {
    const habits = await storageService.getHabits();
    const completions = await storageService.getCompletions();
    
    if (habits.length === 0) {
      toast({
        title: "No habits to export",
        description: "Add some habits first before exporting to PDF.",
        variant: "destructive",
      });
      return;
    }
    
    exportHabitsToPDF(habits, completions);
    
    toast({
      title: "PDF exported",
      description: "Your habits report has been downloaded.",
    });
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.habits) await storageService.saveHabits(data.habits);
            if (data.completions) await storageService.saveCompletions(data.completions);
            if (data.achievements) await storageService.saveAchievements(data.achievements);
            
            toast({
              title: "Import successful",
              description: "Data imported successfully! Please refresh the page to see changes.",
            });
          } catch (error) {
            toast({
              title: "Import failed",
              description: "Error importing data. Please check the file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const confirmClearData = async () => {
    await storageService.saveHabits([]);
    await storageService.saveCompletions([]);
    await storageService.saveAchievements([]);
    await storageService.saveTodos([]);
    toast({
      title: "Data cleared",
      description: "All data has been cleared. Please refresh the page.",
    });
    setShowClearDialog(false);
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b z-40">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-base font-semibold">
                Dark Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark themes
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              data-testid="switch-dark-mode"
            />
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Export & Import</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={exportPDF}
              data-testid="button-export-pdf"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export Habits as PDF
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={exportData}
              data-testid="button-export"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data (JSON)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={importData}
              data-testid="button-import"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Danger Zone</h3>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={() => setShowClearDialog(true)}
            data-testid="button-clear-data"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-sm text-muted-foreground">
            Habit Tracker v1.0
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Track your habits, build streaks, and unlock achievements.
          </p>
        </Card>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent data-testid="dialog-clear-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your habits, completions, and achievements.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-clear">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmClearData}
              data-testid="button-confirm-clear"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
