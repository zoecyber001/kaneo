import { Calendar, Flag, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useCreateTask from "@/hooks/mutations/task/use-create-task";
import useGetProjects from "@/hooks/queries/project/use-get-projects";
import useActiveWorkspace from "@/hooks/queries/workspace/use-active-workspace";
import { parseQuickCaptureInput } from "@/lib/natural-language-parser";
import { toast } from "@/lib/toast";

type QuickCaptureModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProjectId?: string;
};

export default function QuickCaptureModal({
  open,
  onOpenChange,
  defaultProjectId,
}: QuickCaptureModalProps) {
  const [rawText, setRawText] = useState("");
  const { data: workspace } = useActiveWorkspace();
  const { data: projects = [] } = useGetProjects({
    workspaceId: workspace?.id ?? "",
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    defaultProjectId || "",
  );

  const activeProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];
  const { mutate: createTask, isPending } = useCreateTask();

  const parsed = useMemo(() => parseQuickCaptureInput(rawText), [rawText]);

  const handleCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    const projectIdToUse = activeProject?.id;
    if (!projectIdToUse) {
      toast.error("Please select a project first");
      return;
    }

    createTask(
      {
        title: parsed.cleanTitle,
        projectId: projectIdToUse,
        priority: parsed.priority || "low",
        dueDate: parsed.dueDate,
        status: "to-do",
      },
      {
        onSuccess: () => {
          toast.success("Task captured!");
          setRawText("");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to capture task");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-4 gap-3">
        <DialogHeader className="p-0">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Zap className="size-4 text-amber-500 fill-amber-500/20" />
            <span>Quick Brain Dump (Low-Friction Capture)</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCapture} className="space-y-3">
          <Input
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Type anything... e.g. Finish report tomorrow !high"
            className="text-sm h-10 px-3 bg-muted/30 focus-visible:bg-background"
          />

          {rawText.trim() && (
            <div className="flex flex-wrap items-center gap-2 rounded-md bg-muted/40 p-2 text-xs text-muted-foreground border border-border/40">
              <span className="font-medium text-foreground/80">Parsed:</span>
              <span className="font-semibold text-foreground">
                "{parsed.cleanTitle}"
              </span>
              {parsed.priority && (
                <span className="flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-primary text-[11px] font-medium">
                  <Flag className="size-3" />
                  {parsed.priority}
                </span>
              )}
              {parsed.dueDate && (
                <span className="flex items-center gap-1 rounded bg-accent/80 px-1.5 py-0.5 text-foreground text-[11px] font-medium">
                  <Calendar className="size-3" />
                  {parsed.dueDate.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <select
              value={selectedProjectId || activeProject?.id || ""}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus-visible:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!rawText.trim() || isPending}
                className="h-8 text-xs"
              >
                {isPending ? "Capturing..." : "Capture (Enter)"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
