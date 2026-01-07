import { forwardRef } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const inputClasses = `w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 ${
      error
        ? 'border-red-500 focus:border-red-600'
        : 'border-neutral-300 focus:border-primary-500'
    } focus:outline-none ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
