import React from 'react';

const Toast = ({ toasts }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`p-4 rounded shadow-lg text-white ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } transform transition-all duration-300`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;