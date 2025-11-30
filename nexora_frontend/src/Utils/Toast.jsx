import React, { useEffect } from "react";

function Toast({ type = "success", message, onClose }) {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // cleanup if unmounted early
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 ${bgColor} text-white px-4 py-3 rounded shadow-lg z-50`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 font-bold text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
