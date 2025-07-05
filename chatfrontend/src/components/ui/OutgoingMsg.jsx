import React from 'react';

export default function OutgoingMsg({ msg, time }) {
  return (
    <div className="flex justify-end mb-4 group px-2">
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-4 py-2 rounded-3xl rounded-tr-none max-w-[75%] shadow-md">
        
        {/* Tail corner bubble shape */}
        {/* <div className="absolute -right-1.5 top-0 w-3 h-3 overflow-hidden">
          <div className="w-full h-full bg-indigo-500 transform rotate-45 origin-bottom-left" />
        </div> */}

        {/* Message text */}
        <p className="text-sm font-medium break-words">{msg}</p>

        {/* Time + status icon */}
        <p className="text-xs text-purple-100 mt-1 flex justify-end items-center gap-1">
          {time}
          <span className="text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          </span>
        </p>
      </div>
    </div>
  );
}
