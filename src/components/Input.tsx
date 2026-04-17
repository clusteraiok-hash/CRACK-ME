import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-xs text-gray-400 block mb-2">{label}</label>
      )}
      <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
        <input
          className={`
            w-full text-sm outline-none placeholder-gray-300 text-gray-900 bg-transparent
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && (
          <span className="text-gray-400 ml-2">{icon}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-xs text-gray-400 block mb-2">{label}</label>
      )}
      <textarea
        className={`
          w-full text-sm outline-none placeholder-gray-300 text-gray-900
          bg-transparent border-b border-gray-200 pb-2 resize-none
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label?: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-xs text-gray-400 block mb-2">{label}</label>
      )}
      <div className="border-b border-gray-200 pb-2">
        <select
          className={`w-full text-sm outline-none text-gray-900 bg-transparent ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label || opt.value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
