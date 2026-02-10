import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

export default function Calendar({ tasks }) {
  return (
    <FullCalendar
      headerToolbar={""}
      plugins={[listPlugin]}
      initialView="listWeek"
      events={tasks}
    />
  );
}
