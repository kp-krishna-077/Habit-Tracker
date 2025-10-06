import jsPDF from "jspdf";
import type { Habit, Completion } from "@shared/schema";
import { format } from "date-fns";

export const exportHabitsToPDF = (habits: Habit[], completions: Completion[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  const addText = (text: string, x: number, y: number, options?: { fontSize?: number; fontStyle?: string; maxWidth?: number }) => {
    if (options?.fontSize) doc.setFontSize(options.fontSize);
    if (options?.fontStyle) doc.setFont("helvetica", options.fontStyle);
    
    if (options?.maxWidth) {
      const lines = doc.splitTextToSize(text, options.maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * (options.fontSize || 12) * 0.35);
    } else {
      doc.text(text, x, y);
      return y + ((options?.fontSize || 12) * 0.35);
    }
  };

  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("My Habits Report", margin, yPosition);
  yPosition += 15;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${format(new Date(), "MMMM dd, yyyy 'at' h:mm a")}`, margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Habits: ${habits.length}`, margin, yPosition);
  yPosition += 8;
  
  const totalCompletions = completions.filter(c => c.completed).length;
  doc.text(`Total Completions: ${totalCompletions}`, margin, yPosition);
  yPosition += 15;

  habits.forEach((habit, index) => {
    checkNewPage(60);

    doc.setDrawColor(74, 222, 128);
    doc.setFillColor(74, 222, 128);
    doc.rect(margin, yPosition - 5, 3, 40, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    yPosition = addText(`${index + 1}. ${habit.title}`, margin + 8, yPosition, { fontSize: 14, fontStyle: "bold" });
    yPosition += 5;

    if (habit.description) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      yPosition = addText(habit.description, margin + 8, yPosition, { 
        fontSize: 10, 
        maxWidth: pageWidth - 2 * margin - 8 
      });
      yPosition += 5;
    }

    const getFrequencyLabel = () => {
      if (habit.frequencyType === "daily") return "Daily";
      if (habit.frequencyType === "weekly") return "Weekly";
      if (habit.customDays) {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return habit.customDays.map(d => days[d]).join(", ");
      }
      return "Custom";
    };

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Frequency: ${getFrequencyLabel()}`, margin + 8, yPosition);
    yPosition += 6;

    doc.text(`Current Streak: ${habit.currentStreak} days`, margin + 8, yPosition);
    yPosition += 6;

    doc.text(`Best Streak: ${habit.bestStreak} days`, margin + 8, yPosition);
    yPosition += 6;

    const habitCompletions = completions.filter(c => c.habitId === habit.id && c.completed).length;
    doc.text(`Total Completions: ${habitCompletions}`, margin + 8, yPosition);
    yPosition += 8;

    if (habit.bestStreak > 0) {
      const progressWidth = pageWidth - 2 * margin - 8;
      const progressHeight = 4;
      const progressPercentage = Math.min((habit.currentStreak / habit.bestStreak) * 100, 100);
      
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(margin + 8, yPosition, progressWidth, progressHeight, 2, 2, "F");
      
      if (progressPercentage > 0) {
        doc.setFillColor(74, 222, 128);
        doc.roundedRect(margin + 8, yPosition, (progressWidth * progressPercentage) / 100, progressHeight, 2, 2, "F");
      }
      
      yPosition += 10;
    }

    doc.setDrawColor(230, 230, 230);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 12;
  });

  if (habits.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text("No habits to display", margin, yPosition);
  }

  const fileName = `habits-report-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
};
