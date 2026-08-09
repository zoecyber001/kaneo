import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateTaskStatus from "@/fetchers/task/update-task-status";
import { triggerTaskCompletionCelebration } from "@/lib/celebration";
import type Task from "@/types/task";

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Task) => updateTaskStatus(task.id, task),
    onSuccess: (_, variables) => {
      if (variables.status === "done" || variables.status === "archived") {
        triggerTaskCompletionCelebration(variables.title);
      }
      queryClient.invalidateQueries({
        queryKey: ["task", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      queryClient.invalidateQueries({
        queryKey: ["activities", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-relations"],
      });
    },
  });
}
