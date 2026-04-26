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
import GroupModal from "./components/groupModal";
import { deleteTask } from "./utils/eventUtil";

function App() {
  const [tasks, setTasks] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

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

  const [chatList, setChatList] = useState([
    { from: "assistant", message: "How can I help you?" },
  ]);

  const [taskData, setTaskData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    reoccurrence: "",
    allDay: false,
    description: "",
    completed: false,
    tags: "",
  });

  const openGroupModal = () => {
    setIsGroupModalOpen(true);
  };

  function toCalendarTask(task) {
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    const isAllDay =
      start.getHours() === 0 &&
      start.getMinutes() === 0 &&
      end.getHours() === 23 &&
      end.getMinutes() === 59;
    return {
      id: task._id,
      title: task.title,
      start: task.startDate,
      end: task.endDate,
      allDay: isAllDay,
      classNames:
        task.completedAt && task.completedAt.length > 0
          ? ["task-completed"]
          : [],
      extendedProps: {
        description: task.description,
        tags: task.tags,
        completed: task.completedAt && task.completedAt.length > 0,
        reoccurrence: task.reoccurrence,
        groupId: task.groupId,
      },
    };
  }

  const addTask = async (newTask) => {
    const assignedTo = authUser?.user.email || "guest@local";
    const payload = {
      title: newTask.title,
      description: newTask.extendedProps?.description,
      tags: newTask.extendedProps?.tags,
      startDate: newTask.start,
      endDate: newTask.end,
      allDay: newTask.allDay,
      reoccurrence: newTask.extendedProps?.reoccurrence,
      completed: newTask.extendedProps?.completed,
      assignedTo,
      groupId: newTask.extendedProps?.groupId,
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

    setTasks((prev) => [...prev, toCalendarTask(data.task)]);
  };

  const visibleTasks = tasks.filter((task) => {
    console.log(
      "task groupId:",
      task.extendedProps.groupId,
      typeof task.extendedProps.groupId,
    );
    return (
      !task.extendedProps.groupId ||
      task.extendedProps.groupId === "none" ||
      selectedGroups.includes(task.extendedProps.groupId)
    );
  });

  const removeTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const updateTask = async (taskData) => {
    const response = await fetch(`/tasks/${taskData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: taskData.title,
        description: taskData.extendedProps?.description,
        tags: taskData.extendedProps?.tags,
        completed: taskData.extendedProps?.completed,
        startDate: taskData.start,
        endDate: taskData.end,
        allDay: taskData.allDay,
        reoccurrence: taskData.extendedProps?.reoccurrence,
        groupId: taskData.extendedProps?.groupId,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || "Failed to update task");

    if (taskData.extendedProps?.completed) {
      await fetch(`/tasks/completed/${taskData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log("completed value:", taskData.extendedProps?.completed);
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskData.id) {
          const updatedTask = {
            ...data.task,
            completedAt: taskData.extendedProps?.completed
              ? [new Date()]
              : data.task.completedAt,
          };
          console.log("updatedTask:", updatedTask);
          return toCalendarTask(updatedTask);
        }
        return t;
      }),
    );
  };

 // Check localStorage on app load for existing user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedEmail = localStorage.getItem("email");
    const savedId = localStorage.getItem("id");
    if (savedUser) {
      setAuthUser({user: {id: savedId, username: savedUser, email: savedEmail}}); 
    }
  }, []);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/tasks/user/"+localStorage.getItem("email"), {
          credentials: "include",
        });
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
  }, [authUser]);

  const openTaskModal = (eventInfo = null) => {
    setTaskData({
      id: eventInfo?.id || null,
      title: eventInfo?.title || "",
      date: eventInfo?.date || "",
      startTime: eventInfo?.startTime || "",
      endTime: eventInfo?.endTime || "",
      allDay: eventInfo?.allDay ?? false,
      reoccurrence: eventInfo?.reoccurrence || "none",
      completed: eventInfo?.completed ?? false,
      description: eventInfo?.description || "",
      tags: eventInfo?.tags || [],
      groupId: eventInfo?.groupId || null,
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

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setTasks([]);
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
  }

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
            tasks={visibleTasks}
            openTaskModal={openTaskModal}
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
          <button
            onClick={openGroupModal}
            className="task-button"
            disabled={!authUser}
            style={{
              backgroundColor: colors.tertiary,
              color: colors.tertiaryText,
            }}
          >
            <i className="fa-solid fa-plus" />
          </button>
          <GroupList
            User={authUser}
            userGroups={groupList}
            setUserGroups={setGroupList}
            selectedGroups={selectedGroups}
            setSelectedGroups={setSelectedGroups}
          />
        </div>
        <div className="main-content" style={{ color: colors.primaryText }}>
          <Calendar
            tasks={visibleTasks}
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
            Colors={colors}
            onRemoveTask={removeTask}
            deleteTask={deleteTask}
            taskData={taskData}
            groupList={groupList}
            setTasks={setTasks}
            onAddTask={addTask}
            setTaskData={setTaskData}
            authUser={authUser}
            toCalendarTask={toCalendarTask}
            onUpdateTask={updateTask}
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
            User={authUser}
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
          <GroupModal
            isOpen={isGroupModalOpen}
            onClose={closeGroupModal}
            Colors={colors}
            setUserGroups={setGroupList}
            authUser={authUser}
          />
          <Chat chatList={chatList} setChatList={setChatList} Colors={colors} />
        </div>
      </div>
    </div>
  );
}

export default App;
