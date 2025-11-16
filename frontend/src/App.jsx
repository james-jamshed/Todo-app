import React, { useEffect, useState } from 'react';
import Onboarding from './components/Onboarding';
import Home from './components/Home';
import AddTaskModal from './components/AddTaskModal';
import SearchTask from './components/SearchTask';
import { getTasks, createTask, updateTask, deleteTask } from './api';

export default function App(){
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [editingTask, setEditingTask] = useState(null);

  async function loadTasks(){
    try{
      const all = await getTasks();
      setTasks(all);
    }catch(e){ console.error(e) }
  }

  useEffect(()=>{ loadTasks(); }, []);

  const handleCreate = async (payload) => {
    const newTask = await createTask(payload);
    setTasks(s => [newTask, ...s]);
    setShowAddModal(false);
  };

  const handleUpdate = async (id, payload) => {
    const updated = await updateTask(id, payload);
    setTasks(s => s.map(t => t._id === id ? updated : t));
    setShowAddModal(false);
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(s => s.filter(t => t._id !== id));
  };

  if(showOnboarding) return <Onboarding onStart={()=>setShowOnboarding(false)} />;
  if(showSearch) return <SearchTask onBack={()=>setShowSearch(false)} onUpdate={handleUpdate} />;

  return (
    <div className="w-full flex justify-center bg-gray-100">
      <div className="w-[390px] bg-white min-h-screen shadow-lg">

        <Home
          tasks={tasks}
          onAddClick={() => {
            setEditingTask(null);
            setShowAddModal(true);
          }}
          onToggleComplete={async (task) => {
            const status = task.status === 'Completed' ? 'Open' : 'Completed';
            await handleUpdate(task._id, { status });
          }}
          onDelete={handleDelete}
          onSearch={() => setShowSearch(true)}
          onEdit={(task) => {
            setEditingTask(task);
            setShowAddModal(true);
          }}
        />

        {showAddModal && (
          <AddTaskModal
            onClose={() => {
              setShowAddModal(false);
              setEditingTask(null);
            }}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            task={editingTask}
          />
        )}

      </div>
    </div>
  );
}

