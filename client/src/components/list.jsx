import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import { handleEventClick } from "../utils/eventUtil";

export default function TaskList({ tasks, eventDidMount, openTaskModal }) {
  return (
    <FullCalendar
      headerToolbar={""}
      plugins={[listPlugin]}
      initialView="listWeek"
      events={tasks}
      eventClick={(clickInfo) => openTaskModal(handleEventClick(clickInfo))}
      eventDidMount={eventDidMount}
      height="auto"
    />
  );
}
