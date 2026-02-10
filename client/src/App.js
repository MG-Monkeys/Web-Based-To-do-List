import { useState } from "react";
import "./App.css";
import NavBar from "./components/navbar";
import Calendar from "./components/calendar";
import TaskModal from "./components/taskModal";
import TaskList from "./components/list";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <NavBar />
      <div className="flexbox">
        <div className="sidebar">
          <button onClick={openModal}>New Task</button>
          <p>This Week:</p>
          <TaskList tasks={tasks} />
        </div>
        <div className="main-content">
          <Calendar tasks={tasks} />
          <TaskModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onAddTask={addTask}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
