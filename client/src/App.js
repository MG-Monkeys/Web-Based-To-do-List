import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/navbar";
import Calendar from "./components/calendar";
import TaskModal from "./components/taskModal";
import TaskList from "./components/list";
import LoginModal from "./components/loginModal";
import InboxModal from "./components/inboxModal";
import ColorModal from "./components/colorModal";
import GroupList from "./components/groupList";
import Chat from "./components/chat";

function App() {
  const [tasks, setTasks] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
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
        <span>{tooltip.event.extendedProps.tags}</span>
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

  const [chatList, setChatList] = useState([
    { from: "assistant", message: "How can I help you?" },
    { from: "user", message: "I don't know" },
  ]);

  const [selectedTask, setSelectedTask] = useState(null);

  const [taskData, setTaskData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    repeat: "",
    allDay: false,
    description: "",
    completed: false,
    tags: "",
  });

  function toCalendarTask(task) {
    return {
      id: task._id,
      title: task.title,
      start: task.startDate,
      end: task.endDate,
      allDay: task.allDay,
      extendedProps: {
        description: task.description,
        tags: task.tags,
        completed: task.completed,
        repeat: task.repeat,
      },
    };
  }

  // Check localStorage on app load for existing user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    const savedId = localStorage.getItem("id");
    if (savedUser) {
      setAuthUser({user: savedUser, token: savedToken, id: savedId});
    }
  }, []);

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
      description: newTask.extendedProps?.description,
      tags: newTask.extendedProps?.tags,
      startDate: newTask.start,
      endDate: newTask.end,
      allDay: newTask.allDay,
      repeat: newTask.extendedProps?.repeat,
      completed: newTask.extendedProps?.completed,
      assignedTo,
      groupId: "0",
    };

    console.log("PAYLOAD: " + JSON.stringify(payload));

    const response = await fetch("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization" : "Bearer " + authUser?.token },
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

  const openTaskModal = (eventInfo = null) => {
    setSelectedTask(eventInfo);
    setTaskData({
      title: eventInfo?.title || "",
      date: eventInfo?.date || "",
      startTime: eventInfo?.startTime || "",
      endTime: eventInfo?.endTime || "",
      allDay: eventInfo?.allDay ?? false,
      repeat: eventInfo?.repeat || "none",
      completed: eventInfo?.completed ?? false,
      description: eventInfo?.description || "",
      tags: eventInfo?.tags || [],
    });
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeInboxModal = () => {
    setIsInboxModalOpen(false);
  };

  const closeColorModal = () => {
    setIsColorModalOpen(false);
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
  };

  return (
    <div className="App" style={{ backgroundColor: colors.primary }}>
      <NavBar
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
        authUser={authUser}
        onColorClick={() => setIsColorModalOpen(true)}
        Colors={colors}
        onInboxClick={() => setIsInboxModalOpen(true)}
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
          <div className="sidebar-spacer" />
          <h5>This Week:</h5>
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
            openTaskModal={openTaskModal}
          />
          <TooltipBox />
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={closeTaskModal}
            onAddTask={addTask}
            Colors={colors}
            onRemoveTask={removeTask}
            taskData={taskData}
            setTaskData={setTaskData}
          />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={closeLoginModal}
            onAuthSuccess={setAuthUser}
            Colors={colors}
          />
          <InboxModal
            isOpen={isInboxModalOpen}
            onClose={closeInboxModal}
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
          <Chat chatList={chatList} setChatList={setChatList} />
        </div>
      </div>
    </div>
  );
}

export default App;
