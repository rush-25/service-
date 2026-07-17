import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgClass = type === 'success'
    ? 'bg-[#111827] text-white border-l-4 border-blue-500'
    : 'bg-red-500 text-white';

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-short ${bgClass}`}>
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white font-bold ml-2">×</button>
    </div>
  );
};

export default Toast;
