import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

function handleEventClick(clickInfo) {
  if (
    window.confirm(
      `Are you sure you want to delete the event '${clickInfo.event.title}'`,
    )
  ) {
    clickInfo.event.remove();
  }
}

export default function TaskList({ tasks }) {
  return (
    <FullCalendar
      headerToolbar={""}
      plugins={[listPlugin]}
      initialView="listWeek"
      events={tasks}
      eventClick={handleEventClick}
    />
  );
}
