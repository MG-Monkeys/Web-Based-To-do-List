import { useState } from "react";
import "./App.css";
import NavBar from "./components/navbar";
import Calendar from "./components/calendar";
import TaskModal from "./components/taskModal";
import TaskList from "./components/list";
import LoginModal from "./components/loginModal";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

  return (
    <div className="App">
      <NavBar onLoginClick={() => setIsLoginModalOpen(true)} />
      <div className="flexbox">
        <div className="sidebar">
          <button onClick={openTaskModal} className="task-button">
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
        </div>
      </div>
    </div>
  );
}

export default App;
