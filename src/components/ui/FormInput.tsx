import React, { forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  showPasswordToggle?: boolean;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      success,
      showPasswordToggle = false,
      isPassword = false,
      showPassword = false,
      onTogglePassword,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none transition-colors duration-200';
    
    const stateClasses = hasError
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : hasSuccess
      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';

    const inputClasses = `${baseClasses} ${stateClasses} ${className}`;

    return (
      <div className="space-y-1">
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">{leftIcon}</div>
            </div>
          )}
          
          <input
            ref={ref}
            className={`${inputClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon || showPasswordToggle ? 'pr-10' : ''}`}
            {...props}
          />
          
          {(rightIcon || showPasswordToggle) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {showPasswordToggle && isPassword ? (
                <button
                  type="button"
                  className="h-5 w-5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={onTogglePassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              ) : rightIcon ? (
                <div className="h-5 w-5 text-gray-400">{rightIcon}</div>
              ) : null}
            </div>
          )}
        </div>

        {/* Status Icons */}
        {(hasError || hasSuccess) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {hasError ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : hasSuccess ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : null}
          </div>
        )}

        {/* Helper Text / Error Message */}
        {(error || helperText) && (
          <div className="mt-1">
            {error ? (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {error}
              </p>
            ) : helperText ? (
              <p className="text-sm text-gray-500">{helperText}</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
