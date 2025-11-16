import React, { useEffect, useState } from "react";
import { formatISO } from "date-fns";

export default function AddTaskModal({ onClose, onCreate, onUpdate, task }) {
  const isEdit = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    formatISO(new Date(), { representation: "date" })
  );
  const [priority, setPriority] = useState("Low");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Prefill in edit mode
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDate(
        task.date
          ? formatISO(new Date(task.date), { representation: "date" })
          : ""
      );
      setPriority(task.priority || "Low");
      setStartTime(task.startTime || "");
      setEndTime(task.endTime || "");
    }
  }, [task]);

  const submit = () => {
    if (!title || !date) return alert("Title and date required");

    const payload = { title, description, date, priority, startTime, endTime };

    if (isEdit) onUpdate(task._id, payload);
    else onCreate(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-end z-50">
     
      <div className="w-[390px] max-h-[90vh] bg-white rounded-t-3xl p-5 overflow-y-auto shadow-xl">

        
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Task" : "Add New Task"}
          </h2>
          <button onClick={onClose} className="text-xl cursor-pointer">✕</button>
        </div>

        
        <p className="text-[12px] mt-4">Task Title</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-100 p-3 rounded-lg mt-1 text-sm"
          placeholder="Doing Homework"
        />

        {/* Time */}
        <p className="text-[12px] mt-4">Set Time</p>
        <div className="flex gap-3 mt-1">
          <input
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="Start"
            className="bg-gray-100 p-3 rounded-lg flex-1 text-sm"
          />
          <input
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="Ends"
            className="bg-gray-100 p-3 rounded-lg flex-1 text-sm"
          />
        </div>

        {/* Date */}
        <p className="text-[12px] mt-4">Set Date</p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-gray-100 p-3 rounded-lg mt-1 w-full text-sm"
        />

        {/* Priority */}
        <p className="text-[12px] mt-4">Priority</p>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-gray-100 p-3 rounded-lg mt-1 w-full text-sm"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* Description */}
        <p className="text-[12px] mt-4">Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-gray-100 p-3 rounded-lg mt-1 h-24 text-sm"
          placeholder="Add Description"
        />

        {/* Submit Button */}
        <button
          onClick={submit}
          className="w-full bg-blue-500 text-white py-3 mt-6 rounded-lg text-sm font-medium cursor-pointer"
        >
          {isEdit ? "Update Task" : "Create Task"}
        </button>
      </div>
    </div>
  );
}
