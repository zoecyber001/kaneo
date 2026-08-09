export type ParsedTaskInput = {
  cleanTitle: string;
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
};

export function parseQuickCaptureInput(input: string): ParsedTaskInput {
  let title = input.trim();
  let priority: "low" | "medium" | "high" | "urgent" | undefined;
  let dueDate: Date | undefined;

  // 1. Priority parsing (!high, !medium, !low, !urgent)
  if (/\s!high\b/i.test(title) || /^!high\b/i.test(title)) {
    priority = "high";
    title = title.replace(/!high\b/gi, "").trim();
  } else if (/\s!medium\b/i.test(title) || /^!medium\b/i.test(title)) {
    priority = "medium";
    title = title.replace(/!medium\b/gi, "").trim();
  } else if (/\s!low\b/i.test(title) || /^!low\b/i.test(title)) {
    priority = "low";
    title = title.replace(/!low\b/gi, "").trim();
  } else if (/\s!urgent\b/i.test(title) || /^!urgent\b/i.test(title)) {
    priority = "urgent";
    title = title.replace(/!urgent\b/gi, "").trim();
  }

  // 2. Relative date parsing (today, tomorrow, in X days)
  const now = new Date();
  if (/\b(today)\b/i.test(title)) {
    dueDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0);
    title = title.replace(/\b(today)\b/gi, "").trim();
  } else if (/\b(tomorrow)\b/i.test(title)) {
    const tom = new Date(now);
    tom.setDate(tom.getDate() + 1);
    tom.setHours(18, 0, 0, 0);
    dueDate = tom;
    title = title.replace(/\b(tomorrow)\b/gi, "").trim();
  } else {
    const daysMatch = title.match(/\bin (\d+) days\b/i);
    if (daysMatch) {
      const numDays = Number.parseInt(daysMatch[1], 10);
      const future = new Date(now);
      future.setDate(future.getDate() + numDays);
      future.setHours(18, 0, 0, 0);
      dueDate = future;
      title = title.replace(daysMatch[0], "").trim();
    }
  }

  // Clean up extra spaces
  title = title.replace(/\s+/g, " ").trim();

  return {
    cleanTitle: title || input.trim(),
    priority,
    dueDate,
  };
}
