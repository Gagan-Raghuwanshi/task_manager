import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { toast } from "react-toastify";
import TaskModal from "../components/TaskModal";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.name || decoded.email || "User");
      } catch {
        setUsername("User");
      }
    } else {
      navigate("/login");
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch {
      toast.error("Failed to fetch tasks");
    }
  };

  const filteredTasks = filter === "All" ? tasks : tasks.filter(t => t.status === filter);

  const openAddModal = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask.id}`, formData);
        setTasks(tasks.map(t => (t.id === editingTask.id ? data : t)));
        toast.success("Task updated");
      } else {
        const { data } = await api.post("/tasks", formData);
        setTasks([...tasks, data]);
        toast.success("Task added");
      }
      setModalVisible(false);
    } catch {
      toast.error("Failed to save task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-semibold text-blue-600">Task Manager</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700 font-medium">
            👋 Hello, <span className="font-semibold text-gray-900">{username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 text-sm rounded-full hover:bg-red-600 transition"
          >
            Logout
          </button>
          <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold uppercase">
            {username[0]}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>

        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {["All", "Pending", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${filter === status
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {status}
            </button>
          ))}
        </div>


        {/* Task List */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.length === 0 && (
            <div className="text-gray-500 col-span-full text-center">
              No tasks found.
            </div>
          )}
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-all border-l-4 border-blue-500 p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              </div>

              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex flex-col space-y-1 text-gray-500">
                  <span>Due: {task.dueDate?.slice(0, 10) || "N/A"}</span>
                  <span>
                    Status:{" "}
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${task.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                        }`}
                    >
                      {task.status}
                    </span>
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="text-blue-600 hover:text-blue-800 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 hover:text-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Task Modal */}
      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTask}
        mode={editingTask ? "Edit" : "Add"}
      />
    </>
  );
}
