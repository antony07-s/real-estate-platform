import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <input
          ref={ref}
          className={`border rounded-lg px-3 py-2 text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400
  ${
    error
      ? "border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
