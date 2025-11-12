import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full px-4 py-3 rounded-xl transition-all duration-200',
            'backdrop-blur-md bg-white/50 dark:bg-gray-800/50',
            'border border-white/20 dark:border-white/10',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'text-gray-900 dark:text-gray-100',
            error
              ? 'border-blue-500 focus:ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
              : 'focus:ring-primary-500 focus:bg-white/70 dark:focus:bg-gray-800/70',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
