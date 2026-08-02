import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all duration-150 ${
            icon ? 'pl-9 pr-3.5 py-2' : 'px-3.5 py-2'
          } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
