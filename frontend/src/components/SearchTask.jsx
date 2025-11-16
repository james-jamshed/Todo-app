import React, { useEffect, useState } from "react";
import { getTasks, updateTask } from "../api";

export default function SearchTask({ onBack, onUpdate }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  async function performSearch(term) {
    const res = await getTasks({ q: term });
    setResults(res);
  }

  useEffect(() => {
    performSearch("");
  }, []);

  return (
    <div className="w-full flex justify-center bg-gray-100">
      <div className="w-[390px] min-h-screen bg-white p-4 pb-36">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-xl">←</button>

          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && performSearch(q)}
              placeholder="Search tasks"
              className="bg-transparent flex-1 outline-none text-sm"
            />
            <button onClick={() => performSearch(q)} className="text-xl">🔍</button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {results.map((r) => (
            <div
              key={r._id}
              className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200"
            >
              <input
                type="checkbox"
                checked={r.status === "Completed"}
                onChange={async () => {
                  const newStatus =
                    r.status === "Completed" ? "Open" : "Completed";
                  const updated = await updateTask(r._id, {
                    status: newStatus,
                  });

                  setResults((s) =>
                    s.map((x) => (x._id === r._id ? updated : x))
                  );
                  if (onUpdate) onUpdate(r._id, { status: newStatus });
                }}
                className="w-4 h-4"
              />

              <div className="flex-1">
                <p
                  className={`text-sm ${
                    r.status === "Completed"
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {r.title}
                </p>

                <p className="text-xs text-gray-400">
                  {r.description || "No description"}
                </p>
              </div>
            </div>
          ))}
        </div>

        
        <div className="fixed bottom-0 left-0 w-full bg-gray-200 h-36" />
      </div>
    </div>
  );
}
