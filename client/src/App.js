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
    primaryText: "#fefeff",
    secondaryText: "#dedefe",
    tertiaryText: "#acacfc",
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
        <div className="sidebar" style={{ backgroundColor: colors.secondary }}>
          <button
            onClick={openTaskModal}
            className="task-button"
            style={{ backgroundColor: colors.tertiary }}
          >
            New Task
          </button>
          <p>This Week:</p>
          <TaskList tasks={tasks} onRemoveTask={removeTask} />
        </div>
        <div className="main-content">
          <Calendar tasks={tasks} onRemoveTask={removeTask} />
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={closeTaskModal}
            onAddTask={addTask}
          />
          <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
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
