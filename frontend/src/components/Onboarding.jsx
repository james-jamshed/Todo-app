import React from "react";

export default function Onboarding({ onStart }) {
  return (
    <div className="w-full flex justify-center bg-gray-100">
      <div className="w-[390px] min-h-screen bg-white flex flex-col">

        
        <div className="mt-3 mb-10 bg-[#4D63F5] flex-1 relative overflow-hidden">

          
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#667cf8]/40 rounded-full"></div>

         
          <div className="absolute left-5 top-32 opacity-30">
            <ChevronPattern />
          </div>

          
          <div className="absolute right-5 bottom-20 opacity-30">
            <ChevronPattern />
          </div>
        </div>

        {/* White Bottom Sheet */}
        <div className="bg-white rounded-t-3xl p-6 pb-10 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800">Manage What To Do</h1>

          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            The best way to manage what you have to do,<br />don’t forget your plans
          </p>

          <button
            onClick={onStart}
            className="w-full mt-6 py-3 rounded-lg text-white text-sm font-semibold bg-[#4D63F5] cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

/* Chevron Pattern Component */
function ChevronPattern() {
  return (
    <div className="grid grid-cols-5 gap-1">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="w-4 h-4 border-t-4 border-l-4 border-white rotate-[-45deg]"
        ></div>
      ))}
    </div>
  );
}
