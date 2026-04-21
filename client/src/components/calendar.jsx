import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Calendar({
  tasks,
  onRemoveTask,
  Colors,
  eventDidMount,
  openTaskModal,
}) {
  function handleEventClick(clickInfo) {
    const event = clickInfo.event;
    openTaskModal({
      title: event.title,
      start: event.start,
      date: event.startStr?.split("T")[0],
      startTime: event.startStr?.split("T")[1]?.slice(0, 5),
      endTime: event.endStr?.split("T")[1]?.slice(0, 5),
      allDay: event.allDay,
      repeat: event.extendedProps.repeat,
      description: event.extendedProps.description,
      tags: event.extendedProps.tags,
      completed: event.extendedProps.completed,
    });
  }

  return (
    <div
      style={{
        "--fc-button-bg-color": Colors.tertiary,
        "--fc-button-text-color": Colors.tertiaryText,
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={tasks}
        eventClick={handleEventClick}
        eventDidMount={eventDidMount}
        onRemoveTask={onRemoveTask}
      />
    </div>
  );
}
