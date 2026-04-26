export function handleEventClick(clickInfo) {
  const result = {
    id: clickInfo.event.id,
    title: clickInfo.event.title,
    start: clickInfo.event.start,
    date: clickInfo.event.startStr?.split("T")[0],
    startTime: clickInfo.event.startStr?.split("T")[1]?.slice(0, 5),
    endTime: clickInfo.event.endStr?.split("T")[1]?.slice(0, 5),
    allDay: clickInfo.event.allDay,
    reoccurrence: clickInfo.event.extendedProps.reoccurrence,
    description: clickInfo.event.extendedProps.description,
    tags: clickInfo.event.extendedProps.tags,
    completed: clickInfo.event.extendedProps.completed,
    groupId: clickInfo.event.extendedProps.groupId,
  };
  return result;
}

export async function deleteTask(taskId) {
  const response = await fetch(`/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
  console.log("Task deleted");
}
