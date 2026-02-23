import { useState } from "react";
import "./App.css";
import NavBar from "./components/navbar";
import Calendar from "./components/calendar";
import TaskModal from "./components/taskModal";
import TaskList from "./components/list";
import LoginModal from "./components/loginModal";
import ColorModal from "./components/colorModal";

function App() {
  const [tasks, setTasks] = useState([]);
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

  const handleColorChange = (key, value) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
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
            New Task
          </button>
          <p>This Week:</p>
          <TaskList tasks={tasks} onRemoveTask={removeTask} />
        </div>
        <div className="main-content" style={{ color: colors.primaryText }}>
          <Calendar tasks={tasks} onRemoveTask={removeTask} />
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={closeTaskModal}
            onAddTask={addTask}
            Colors={colors}
          />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={closeLoginModal}
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
