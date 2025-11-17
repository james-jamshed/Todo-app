import { format } from "date-fns";
import React, { useState } from "react";

const COLORS = {
  blueDark: "#3E4CB9",
  bluePrimary: "#4F6AF3",
  blueLight: "#D8D6F8",
  pendingBg: "#F7DDE1",
  pendingIcon: "#D36A71",
  cardShadow: "rgba(16,24,40,0.03)"
};

function WeekStrip() {
  const today = new Date();

  const days = [...Array(7)].map((_, i) => {
    const date = new Date();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1));
    monday.setDate(monday.getDate() + i);

    return {
      label: format(monday, "EEE"),
      date: format(monday, "dd"),
      active: monday.toDateString() === today.toDateString(),
    };
  });

  return (
    <div className="grid grid-cols-7 text-center mt-5 px-1">
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center">
          <p className={`text-xs ${d.active ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
            {d.label}
          </p>

          <div
            className={`mt-1 px-3 py-1 rounded-lg text-sm flex flex-col items-center justify-center ${
              d.active ? "bg-blue-600 text-white" : "text-gray-600"
            }`}>
            <span>{d.date}</span>
            {d.active && <span className="w-1.5 h-1.5 bg-white rounded-full mt-1"></span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const dateLabel = format(new Date(task.date), "EEEE d, MMMM");

  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task)}
          className={`w-5 h-5 rounded-sm flex items-center justify-center border text-xs ${
            task.status === "Completed"
              ? "bg-blue-600 border-transparent text-white"
              : "border-gray-300 text-gray-300"
          }`}
        >
          {task.status === "Completed" && "✓"}
        </button>

        <div>
          <p className={`text-sm ${task.status === "Completed" ? "line-through text-gray-400" : "text-gray-800"}`}>
            {task.title}
          </p>
          <p className="text-xs text-gray-400">{task.priority} • {dateLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xl">
        <button onClick={() => onEdit(task)} className="text-blue-500 cursor-pointer">✏️</button>
        <button onClick={() => onDelete(task._id)} className="text-red-500 cursor-pointer">🗑️</button>
      </div>
    </div>
  );
}

export default function Home({
  tasks = [],
  onAddClick,
  onToggleComplete,
  onDelete,
  onEdit,
  onSearch,
}) {

  // TODAY TASKS
  const todayISO = new Date().toISOString().slice(0, 10);

  const todayTasks = tasks.filter(t =>
    (t.date || "").slice(0, 10) === todayISO
  );

  const [showAll, setShowAll] = useState(false);
  const tasksToShow = showAll ? todayTasks : todayTasks.slice(0, 5);

  // WEEKLY PROGRESS
  const now = new Date();

  const monday = new Date(now);
  const wd = monday.getDay();
  monday.setDate(monday.getDate() - (wd === 0 ? 6 : wd - 1));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const mondayISO = monday.toISOString().slice(0, 10);
  const sundayISO = sunday.toISOString().slice(0, 10);

  const weeklyTasks = tasks.filter(t => {
    const d = (t.date || "").slice(0, 10);
    return d >= mondayISO && d <= sundayISO;
  });

  const weeklyCompleted = weeklyTasks.filter(t => t.status === "Completed").length;
  const weeklyPending = weeklyTasks.length - weeklyCompleted;

  const weeklyProgress = weeklyTasks.length
    ? Math.round((weeklyCompleted / weeklyTasks.length) * 100)
    : 0;

  return (
    <div className="w-full flex justify-center bg-gray-50">
      <div className="w-[390px] bg-white min-h-screen p-4 pb-28">

        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 shadow-sm">
          <input
            placeholder="Search for a task"
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button onClick={onSearch} className="text-gray-600 text-xl cursor-pointer">🔍</button>
        </div>

        <WeekStrip />

        {/* Summary Cards */}
        <div className="flex gap-3 mt-6">

          <div className="flex-1 p-4 rounded-xl bg-[#EEF2FF] shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-xl">☑️</span>
              <p className="text-xs text-gray-600">Task Complete</p>
            </div>
            <p className="text-3xl font-semibold mt-2">{String(weeklyCompleted).padStart(2, "0")}</p>
            <p className="text-[10px] text-gray-400">This Week</p>
          </div>

          <div className="flex-1 p-4 rounded-xl bg-[#FDE8E9] shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-xl">❌</span>
              <p className="text-xs text-gray-600">Task Pending</p>
            </div>
            <p className="text-3xl font-semibold mt-2">{String(weeklyPending).padStart(2, "0")}</p>
            <p className="text-[10px] text-gray-400">This Week</p>
          </div>

        </div>

        {/* WEEKLY PROGRESS */}
        <p className="mt-6 font-semibold text-sm">Weekly Progress</p>

        <div className="mt-2 rounded-full overflow-hidden" style={{ height: 12 }}>
          <div className="flex rounded-full h-full">
            <div
              style={{ width: `${weeklyProgress}%`, background: COLORS.blueDark, transition: "0.3s" }}
            />
            <div
              style={{ width: `${100 - weeklyProgress}%`, background: COLORS.blueLight }}
            />
          </div>
        </div>

        {/* Today Tasks Header */}
        <div className="flex justify-between mt-6 items-center">
          <p className="font-bold text-sm">Tasks Today</p>

          <button
            className="text-sm text-blue-500"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "View Less" : "View All"}
          </button>
        </div>

        {/* Task List */}
        <div className="mt-4 space-y-3">
          {tasksToShow.length === 0 && (
            <p className="text-gray-400 text-sm">No tasks for today</p>
          )}

          {tasksToShow.map(task => (
            <TaskRow
              key={task._id}
              task={task}
              onToggle={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>

        <div style={{ height: 80 }} />

        {/* Floating Add Button */}
        <button
          onClick={onAddClick}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-600 rounded-full text-white text-4xl shadow-xl flex items-center justify-center cursor-pointer"
        >
          +
        </button>

      </div>
    </div>
  );
}
