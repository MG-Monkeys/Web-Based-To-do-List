import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { handleEventClick } from "../utils/eventUtil";

export default function Calendar({
  tasks,
  Colors,
  eventDidMount,
  openTaskModal,
}) {
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
        eventClick={(clickInfo) => openTaskModal(handleEventClick(clickInfo))}
        eventDidMount={eventDidMount}
      />
    </div>
  );
}
