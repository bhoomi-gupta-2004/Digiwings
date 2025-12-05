import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// API
const API_URL = 'http://localhost:3000/api/tasks';

// Create a reusable axios instance with the Authorization header
// This assumes the token is stored in localStorage after a successful login.
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Use an interceptor to add the token to every request
// This is a more elegant solution than manually adding the header to each call.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const taskCategories = [
  { name: 'Coding', color: 'bg-purple-500' },
  { name: 'Design', color: 'bg-pink-500' },
  { name: 'Marketing', color: 'bg-blue-500' },
  { name: 'Personal', color: 'bg-green-500' },
];

const taskPriorities = [
  { label: 'Low', color: 'bg-green-400' },
  { label: 'Medium', color: 'bg-yellow-400' },
  { label: 'High', color: 'bg-red-500' },
];

// ... (All other components like TaskProgressBar, AddTaskForm, TaskFilters, TaskItem, TaskList remain the same)
// I'll omit them here for brevity, but they should be kept in your file.

// ---

const TaskProgressBar = ({ completed, total }) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return (
        <div className="mb-6 p-4 bg-black/15 backdrop-blur-md border border-white/40 rounded-xl text-white shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Overall Progress</span>
                <span className="font-bold">{percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-500 rounded-full">
                <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-red-600 to-green-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <p className="mt-2 text-gray-400 text-sm">
                {completed} of {total} total tasks completed.
            </p>
        </div>
    );
};

const AddTaskForm = ({ onAddTask, categories, priorities }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState(categories[0]?.name || '');
    const [priority, setPriority] = useState(priorities[0]?.label || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !description || !dueDate) return;
        onAddTask({ title, description, dueDate, category, priority });
        setTitle('');
        setDescription('');
        setDueDate('');
        setCategory(categories[0]?.name || '');
        setPriority(priorities[0]?.label || '');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-3 items-center p-4 bg-black/15 backdrop-blur-md border border-white/40 rounded-xl">
            <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-grow p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="flex-grow p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                {categories.map((c) => (<option key={c.name} value={c.name}>{c.name}</option>))}
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                {priorities.map((p) => (<option key={p.label} value={p.label}>{p.label}</option>))}
            </select>
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition">Add Task</button>
        </form>
    );
};

const TaskFilters = ({ searchTerm, onSearchChange, filterStatus, onFilterChange }) => {
    const filterButtons = ['All', 'Pending', 'Completed'];
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-black/15 backdrop-blur-md border border-white/40 rounded-xl gap-4">
            <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={onSearchChange}
                className="w-full sm:w-auto flex-grow p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex items-center gap-2">
                <span className="text-gray-400 font-semibold">Show:</span>
                {filterButtons.map(status => (
                    <button
                        key={status}
                        onClick={() => onFilterChange(status)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${filterStatus === status ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>
    );
};


const TaskItem = ({ task, onToggleComplete, onDeleteTask, getCategoryColor, getPriorityColor }) => {
    const now = new Date();
    const dueDate = new Date(task.due_date); // Note the change from 'dueDate' to 'due_date'
    const oneDay = 24 * 60 * 60 * 1000;

    const isOverdue = !task.completed && dueDate < now;
    const isDueSoon = !task.completed && dueDate > now && dueDate.getTime() - now.getTime() < oneDay;

    const borderColorClass = isOverdue
        ? 'border-2 border-red-500'
        : isDueSoon
            ? 'border-2 border-yellow-500'
            : 'border-transparent border-2';

    return (
        <li className={`p-4 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center bg-black/15 backdrop-blur-md border border-white/40 transition transform hover:scale-[1.02] ${task.completed ? 'opacity-50' : ''} ${borderColorClass}`}>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h3 className={`text-white font-bold text-lg ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
                    <span className="text-gray-400 text-sm">{dueDate.toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 mt-1">{task.description}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getCategoryColor(task.category)}`}>{task.category}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getPriorityColor(task.priority)}`}>{task.priority}</span>

                    {isOverdue && (
                        <span className="px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold">Overdue</span>
                    )}
                    {isDueSoon && (
                        <span className="px-2 py-1 rounded bg-yellow-500 text-white text-xs font-semibold">Due Soon</span>
                    )}
                </div>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4">
                <button onClick={() => onToggleComplete(task.id, task.completed)} className={`px-4 py-2 rounded-lg font-semibold text-white transition ${task.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}>
                    {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => onDeleteTask(task.id)} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition">Delete</button>
            </div>
        </li>
    );
};

const TaskList = ({ tasks, ...props }) => {
    if (tasks.length === 0) {
        return <p className="text-gray-400 text-center mt-8">No tasks to display.</p>;
    }
    return (
        <ul className="space-y-4">
            {tasks.map((task) => (<TaskItem key={task.id} task={task} {...props} />))}
        </ul>
    );
};

const SingleFileTaskDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Fetch tasks from the backend on component mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Use the configured API instance
                const response = await api.get('/tasks');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    const handleAddTask = async (taskData) => {
        try {
            // Use the configured API instance
            const response = await api.post('/tasks', {
                ...taskData,
                completed: false,
            });
            // Add the new task from the server's response to the local state
            setTasks([response.data, ...tasks]);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleToggleComplete = async (id, currentStatus) => {
        try {
            // Use the configured API instance
            const response = await api.put(`/tasks/${id}`, {
                completed: !currentStatus,
            });
            // Update the local state with the server's response
            setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
        } catch (error) {
            console.error('Error toggling task completion:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            // Use the configured API instance
            await api.delete(`/tasks/${id}`);
            // Remove the task from the local state
            setTasks(tasks.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const getCategoryColor = (name) => taskCategories.find((c) => c.name === name)?.color || 'bg-gray-500';
    const getPriorityColor = (label) => taskPriorities.find((p) => p.label === label)?.color || 'bg-gray-500';

    const completedTasks = tasks.filter((t) => t.completed).length;

    const filteredTasks = useMemo(() => {
        return tasks
            .filter(task => {
                if (filterStatus === 'Completed') return task.completed;
                if (filterStatus === 'Pending') return !task.completed;
                return true;
            })
            .filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [tasks, filterStatus, searchTerm]);

    return (
        <div className="min-h-screen text-white p-4 sm:p-8 overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center">ToDo</h1>

                <TaskProgressBar completed={completedTasks} total={tasks.length} />

                <AddTaskForm
                    onAddTask={handleAddTask}
                    categories={taskCategories}
                    priorities={taskPriorities}
                />

                <TaskFilters
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    filterStatus={filterStatus}
                    onFilterChange={setFilterStatus}
                />

                <TaskList
                    tasks={filteredTasks}
                    onToggleComplete={handleToggleComplete}
                    onDeleteTask={handleDeleteTask}
                    getCategoryColor={getCategoryColor}
                    getPriorityColor={getPriorityColor}
                />
            </div>
        </div>
    );
};

export default SingleFileTaskDashboard;
