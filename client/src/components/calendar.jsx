import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Calendar({ tasks, onRemoveTask }) {
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
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={tasks}
      eventClick={handleEventClick}
    />
  );
}
