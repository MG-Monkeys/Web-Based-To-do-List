import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/navbar";
import Calendar from "./components/calendar";
import TaskModal from "./components/taskModal";
import TaskList from "./components/list";
import LoginModal from "./components/loginModal";
import ColorModal from "./components/colorModal";
import GroupList from "./components/groupList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  const [colors, setColors] = useState({
    primary: "#fefeff",
    secondary: "#dedefe",
    tertiary: "#acacfc",
    primaryText: "#0000000",
    secondaryText: "#0000000",
    tertiaryText: "#0000000",
  });

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    event: null,
  });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const TooltipBox = () => {
    console.log(tooltip.event);
    if (!tooltip.visible || !tooltip.event) return null;
    const { title, start, end } = tooltip.event;

    return (
      <div
        className="fc-tooltip"
        style={{ top: tooltip.y + 12, left: tooltip.x + 12 }}
      >
        <strong>{title}</strong>
        <span>
          {formatTime(start)} - {formatTime(end)}
        </span>
        <span>{tooltip.event.extendedProps.description}</span>
        <span>{tooltip.event.tags}</span>
      </div>
    );
  };

  const handleColorChange = (key, value) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const groupList = [
    { id: 1, name: "grup1" },
    { id: 2, name: "grup2" },
    { id: 3, name: "grup3" },
  ];

  function toCalendarTask(task) {
    return {
      id: task._id,
      title: task.title,
      start: task.startDate,
      end: task.endDate,
      allDay: false,
      description: task.description,
    };
  }

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/tasks");
        if (response.status === 404) {
          setTasks([]);
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to load tasks");
        }

        const data = await response.json();
        setTasks(data.map(toCalendarTask));
      } catch (error) {
        console.error(error);
      }
    }

    fetchTasks();
  }, []);

  const addTask = async (newTask) => {
    const assignedTo = authUser?.email || "guest@local";
    const payload = {
      title: newTask.title,
      description: newTask.description || "",
      startDate: newTask.start,
      endDate: newTask.end,
      assignedTo,
      groupId: "0",
    };

    const response = await fetch("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to create task");
    }

    setTasks((prevTasks) => [...prevTasks, toCalendarTask(data.task)]);
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const openTaskModal = () => {
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeColorModal = () => {
    setIsColorModalOpen(false);
  };

  return (
    <div className="App" style={{ backgroundColor: colors.primary }}>
      <NavBar
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={() => setAuthUser(null)}
        authUser={authUser}
        onColorClick={() => setIsColorModalOpen(true)}
        Colors={colors}
      />
      <div className="flexbox">
        <div
          className="sidebar"
          style={{
            backgroundColor: colors.secondary,
            color: colors.secondaryText,
          }}
        >
          <button
            onClick={openTaskModal}
            className="task-button"
            style={{
              backgroundColor: colors.tertiary,
              color: colors.tertiaryText,
            }}
          >
            <i className="fa-solid fa-plus" />
          </button>
          <p>This Week:</p>
          <TaskList
            tasks={tasks}
            onRemoveTask={removeTask}
            eventDidMount={(info) => {
              info.el.addEventListener("mouseenter", (e) => {
                setTooltip({
                  visible: true,
                  x: e.clientX,
                  y: e.clientY,
                  event: info.event,
                });
              });
              info.el.addEventListener("mousemove", (e) => {
                setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
              });
              info.el.addEventListener("mouseleave", () => {
                setTooltip((prev) => ({ ...prev, visible: false }));
              });
            }}
          />
          <div className="sidebar-spacer" />
          <GroupList groupList={groupList} />
        </div>
        <div className="main-content" style={{ color: colors.primaryText }}>
          <Calendar
            tasks={tasks}
            onRemoveTask={removeTask}
            Colors={colors}
            eventDidMount={(info) => {
              info.el.addEventListener("mouseenter", (e) => {
                setTooltip({
                  visible: true,
                  x: e.clientX,
                  y: e.clientY,
                  event: info.event,
                });
              });
              info.el.addEventListener("mousemove", (e) => {
                setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
              });
              info.el.addEventListener("mouseleave", () => {
                setTooltip((prev) => ({ ...prev, visible: false }));
              });
            }}
          />
          <TooltipBox />
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={closeTaskModal}
            onAddTask={addTask}
            Colors={colors}
          />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={closeLoginModal}
            onAuthSuccess={setAuthUser}
            Colors={colors}
          />
          <ColorModal
            isOpen={isColorModalOpen}
            onClose={closeColorModal}
            onColorChange={handleColorChange}
            primaryColor={colors.primary}
            secondaryColor={colors.secondary}
            tertiaryColor={colors.tertiary}
            primaryText={colors.primaryText}
            secondaryText={colors.secondaryText}
            tertiaryText={colors.tertiaryText}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
