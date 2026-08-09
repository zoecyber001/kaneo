export type DueDateStatus =
  | "overdue"
  | "due-soon"
  | "far-future"
  | "no-due-date";

type CompletionColumn = { slug: string; isFinal: boolean };

// Columns are user-configurable, so completion comes from the column's isFinal
// flag. The slug check is the fallback for surfaces that render before columns
// load, or that never have them.
export function isTaskCompleted(
  status: string,
  columns?: CompletionColumn[],
): boolean {
  if (columns?.length) {
    return columns.find((column) => column.slug === status)?.isFinal ?? false;
  }
  return status === "done" || status === "archived";
}

export function getDueDateStatus(
  dueDate: string | null,
  isCompleted = false,
): DueDateStatus {
  if (!dueDate) return "no-due-date";
  // A finished task cannot be late, so it keeps the neutral badge.
  if (isCompleted) return "far-future";

  const now = new Date();
  const due = new Date(dueDate);
  const diffInDays = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays < 0) return "overdue";
  if (diffInDays <= 3) return "due-soon";
  return "far-future";
}

export function getRelativeDueDateText(
  dueDate: string | Date | null,
  isCompleted = false,
): string {
  if (!dueDate) return "";
  if (isCompleted) return "Completed";

  const now = new Date();
  const due = new Date(dueDate);
  const diffInMs = due.getTime() - now.getTime();
  const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMs < 0) {
    const absDays = Math.abs(diffInDays);
    if (absDays === 0) return "Overdue today";
    if (absDays === 1) return "Overdue by 1 day";
    return `Overdue by ${absDays} days`;
  }

  if (diffInHours <= 1 && diffInHours > 0) return "Due in <1 hour";
  if (diffInHours < 24) return `Due in ${diffInHours} hours`;
  if (diffInDays === 1) return "Due tomorrow";
  if (diffInDays <= 7) return `Due in ${diffInDays} days`;

  return `Due ${due.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export const dueDateStatusColors = {
  overdue: "bg-destructive/10 text-destructive-foreground",
  "due-soon": "bg-warning/10 text-warning-foreground",
  "far-future": "bg-muted/50 text-muted-foreground",
  "no-due-date": "bg-muted/50 text-muted-foreground",
} as const;

export const dueDateStatusIcons = {
  overdue: "calendar-x",
  "due-soon": "calendar-clock",
  "far-future": "calendar",
  "no-due-date": "calendar",
} as const;
