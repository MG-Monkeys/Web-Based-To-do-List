import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

export default function TaskList({ tasks, onRemoveTask, eventDidMount }) {
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
      headerToolbar={""}
      plugins={[listPlugin]}
      initialView="listWeek"
      events={tasks}
      eventClick={handleEventClick}
      eventDidMount={eventDidMount}
    />
  );
}
