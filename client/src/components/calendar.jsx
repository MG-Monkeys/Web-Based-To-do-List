import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Calendar({
  tasks,
  onRemoveTask,
  Colors,
  eventDidMount,
}) {
  function handleEventClick(clickInfo) {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`,
      )
    ) {
      onRemoveTask(clickInfo.event.id);
    }
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
      />
    </div>
  );
}
