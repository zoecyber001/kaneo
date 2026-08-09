import { Bookmark, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type TaskContextNoteProps = {
  taskId: string;
  className?: string;
};

export default function TaskContextNote({
  taskId,
  className,
}: TaskContextNoteProps) {
  const { t } = useTranslation();
  const storageKey = `kaneo:task:context:${taskId}`;
  const [note, setNote] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setNote(parsed.text || "");
        setLastSaved(parsed.timestamp || null);
      } else {
        setNote("");
        setLastSaved(null);
      }
    } catch {
      setNote("");
    }
  }, [taskId, storageKey]);

  const handleSave = () => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ text: note, timestamp }),
      );
      setLastSaved(timestamp);
      setIsEditing(false);
    } catch {
      // ignore quota error
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border/80 bg-card/60 p-3 shadow-2xs transition-colors",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
          <Bookmark className="size-3.5 text-primary/80" />
          <span>{t("tasks:contextNote.title", { defaultValue: "Where I left off..." })}</span>
        </div>
        {lastSaved && !isEditing && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3" />
            <span>{lastSaved}</span>
          </span>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("tasks:contextNote.placeholder", {
              defaultValue:
                "e.g., Left off writing tests for the API handler on line 42",
            })}
            rows={2}
            className="w-full resize-none rounded-md border border-input bg-transparent px-2.5 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            autoFocus
          />
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setIsEditing(false)}
              className="text-xs h-7"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="xs"
              onClick={handleSave}
              className="text-xs h-7"
            >
              Save Context
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="group cursor-pointer rounded-md border border-dashed border-border/60 p-2 hover:border-primary/50 transition-colors"
        >
          {note ? (
            <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {note}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/70 italic">
              {t("tasks:contextNote.empty", {
                defaultValue:
                  "+ Add a context note to easily resume this task later",
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
