import React from "react";
import { X, XCircle } from "lucide-react";

interface ErrorToastProps {
  message: string;
  onClose?: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-center w-full max-w-md p-4 mb-4 rounded-lg shadow-sm text-red-200 bg-red-800 fixed bottom-6 right-6 toast-bounce-in"
    >
      <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-red-800 text-red-200">
        <XCircle className="w-5 h-5 stroke-red-200" />
        <span className="sr-only">Error icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        onClick={onClose}
        className="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8 text-red-200 hover:text-white"
        aria-label="Close"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
