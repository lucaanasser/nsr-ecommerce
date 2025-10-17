'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

/**
 * Input Component
 * 
 * Campo de entrada padronizado com suporte para múltiplos tipos
 */

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'checkbox' | 'radio';

interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  containerClassName?: string;
}

interface StandardInputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: Exclude<InputType, 'checkbox' | 'radio'>;
  as?: 'input';
}

interface CheckboxInputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type: 'checkbox' | 'radio';
  as?: 'input';
}

interface TextareaInputProps extends BaseInputProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea';
  rows?: number;
}

type InputProps = StandardInputProps | CheckboxInputProps | TextareaInputProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText,
    className = '',
    containerClassName = '',
    ...props
  }, ref) => {
    const as = 'as' in props ? props.as : 'input';
    const type = 'type' in props ? props.type : 'text';
    
    const isCheckboxOrRadio = type === 'checkbox' || type === 'radio';

    const baseInputStyles = 'w-full px-4 py-3 bg-dark-card border border-dark-border rounded-sm text-primary-white placeholder:text-primary-white/40 focus:outline-none focus:border-primary-gold transition-colors duration-300';
    
    const checkboxRadioStyles = 'w-4 h-4 bg-dark-card border border-dark-border rounded-sm text-primary-gold focus:ring-2 focus:ring-primary-gold/50 focus:ring-offset-0 cursor-pointer';

    const errorStyles = error ? 'border-red-500 focus:border-red-500' : '';
    
    const inputClassName = isCheckboxOrRadio 
      ? `${checkboxRadioStyles} ${className}`
      : `${baseInputStyles} ${errorStyles} ${className}`;

    const renderInput = () => {
      if (as === 'textarea') {
        const textareaProps = props as TextareaInputProps;
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputClassName}
            rows={textareaProps.rows || 4}
            {...textareaProps}
          />
        );
      }

      const inputProps = props as StandardInputProps | CheckboxInputProps;
      return (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type={type}
          className={inputClassName}
          {...inputProps}
        />
      );
    };

    if (isCheckboxOrRadio) {
      return (
        <div className={`flex items-start gap-3 ${containerClassName}`}>
          {renderInput()}
          {label && (
            <label className="text-primary-white/90 cursor-pointer select-none">
              {label}
            </label>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>
      );
    }

    return (
      <div className={`flex flex-col gap-2 ${containerClassName}`}>
        {label && (
          <label className="text-primary-white/90 font-medium text-sm">
            {label}
          </label>
        )}
        {renderInput()}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-primary-white/60 text-sm">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
