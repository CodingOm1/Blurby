import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

const AlertBubble = ({ message, type = 'good', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const alertStyles = {
    good: 'bg-purple-800 text-white',
    bad: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-auto animate-fade-in">
      <div className={`px-5 py-3 rounded-lg shadow-lg flex items-center justify-between ${alertStyles[type]}`}>
        <span>{message}</span>
        <button 
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-4 hover:opacity-70 transition-opacity"
        >
          <IoClose className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default AlertBubble;