'use client';

import * as React from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  InputGroupText,
} from '@/components/ui/input-group';

/**
 * Variants for the input container styling
 */
const inputWithAdornmentsVariants = cva(
  'group/input-enhanced transition-all duration-200 ease-out',
  {
    variants: {
      size: {
        xs: 'h-7 text-xs [&_input]:h-7 [&_input]:text-xs [&_input]:px-2',
        sm: 'h-8 text-sm [&_input]:h-8 [&_input]:text-sm [&_input]:px-2.5',
        md: 'h-9 text-sm [&_input]:h-9 [&_input]:text-sm [&_input]:px-3',
        lg: 'h-10 text-base [&_input]:h-10 [&_input]:text-base [&_input]:px-3.5',
        xl: 'h-12 text-base [&_input]:h-12 [&_input]:text-base [&_input]:px-4',
      },
      radius: {
        none: 'rounded-none [&_input]:rounded-none',
        sm: 'rounded-sm [&_input]:rounded-sm',
        md: 'rounded-md [&_input]:rounded-md',
        lg: 'rounded-lg [&_input]:rounded-lg',
        xl: 'rounded-xl [&_input]:rounded-xl',
        full: 'rounded-full [&_input]:rounded-full',
      },
      variant: {
        outline: 'border-input bg-transparent',
        filled:
          'border-transparent bg-muted/50 hover:bg-muted/70 focus-within:bg-background focus-within:border-input',
        ghost:
          'border-transparent bg-transparent hover:bg-muted/30 focus-within:bg-muted/50 focus-within:border-input',
      },
    },
    defaultVariants: {
      size: 'md',
      radius: 'md',
      variant: 'outline',
    },
  },
);

/**
 * Props for the InputWithAdornments component
 */
export interface InputWithAdornmentsProps
  extends Omit<React.ComponentProps<'input'>, 'size'>,
    VariantProps<typeof inputWithAdornmentsVariants> {
  /** Label text for the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message to display */
  error?: string | string[];
  /** Icon or content to display on the left side */
  leftAdornment?: React.ReactNode;
  /** Icon or content to display on the right side */
  rightAdornment?: React.ReactNode;
  /** Whether to show a clear button when input has value */
  clearable?: boolean;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Whether the input is in an error state */
  isInvalid?: boolean;
  /** Custom className for the field container */
  fieldClassName?: string;
  /** Custom className for the input group */
  groupClassName?: string;
  /** Whether to disable animations */
  disableAnimations?: boolean;
}

/**
 * Enhanced Input component with adornments, variants, and animations
 *
 * @example
 * ```tsx
 * <InputWithAdornments
 *   label="Email"
 *   placeholder="Enter your email"
 *   leftAdornment={<MailIcon className="w-4 h-4" />}
 *   clearable
 *   helperText="We'll never share your email"
 * />
 * ```
 */
const InputWithAdornments = React.memo(
  React.forwardRef<HTMLInputElement, InputWithAdornmentsProps>(
    (
      {
        className,
        fieldClassName,
        groupClassName,
        size = 'md',
        radius = 'md',
        variant = 'outline',
        label,
        helperText,
        error,
        leftAdornment,
        rightAdornment,
        clearable = false,
        onClear,
        isInvalid,
        disableAnimations = false,
        value,
        onChange,
        disabled,
        required,
        ...props
      },
      ref,
    ) => {
      const [internalValue, setInternalValue] = React.useState(value || '');
      const [isFocused, setIsFocused] = React.useState(false);
      const inputRef = React.useRef<HTMLInputElement>(null);

      // Use forwarded ref or internal ref
      const actualRef = ref || inputRef;

      // Sync internal value with external value
      React.useEffect(() => {
        if (value !== undefined) {
          setInternalValue(value);
        }
      }, [value]);

      const hasValue = Boolean(
        internalValue && String(internalValue).length > 0,
      );
      const showClearButton = clearable && hasValue && !disabled;
      const hasError = Boolean(error) || isInvalid;

      const handleInputChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          setInternalValue(newValue);
          onChange?.(e);
        },
        [onChange],
      );

      const handleClear = React.useCallback(() => {
        setInternalValue('');
        onClear?.();

        // Create synthetic event for onChange
        if (
          onChange &&
          actualRef &&
          'current' in actualRef &&
          actualRef.current
        ) {
          const syntheticEvent = {
            target: { ...actualRef.current, value: '' },
            currentTarget: actualRef.current,
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }

        // Focus input after clearing
        if (actualRef && 'current' in actualRef && actualRef.current) {
          actualRef.current.focus();
        }
      }, [onClear, onChange, actualRef]);

      const handleFocus = React.useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
          setIsFocused(true);
          props.onFocus?.(e);
        },
        [props],
      );

      const handleBlur = React.useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
          setIsFocused(false);
          props.onBlur?.(e);
        },
        [props],
      );

      // Animation variants
      const containerVariants: Variants = {
        idle: { scale: 1 },
        focused: {
          scale: disableAnimations ? 1 : 1.01,
          transition: { type: 'spring', stiffness: 400, damping: 25 },
        },
        error: disableAnimations
          ? {}
          : {
              x: [0, -5, 5, -5, 5, 0],
              transition: { duration: 0.4 },
            },
      };

      const clearButtonVariants: Variants = {
        hidden: {
          opacity: 0,
          scale: 0.8,
          transition: { duration: 0.15 },
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { type: 'spring', stiffness: 500, damping: 25 },
        },
        hover: {
          scale: disableAnimations ? 1 : 1.1,
          transition: { type: 'spring', stiffness: 400, damping: 25 },
        },
      };

      return (
        <Field
          className={cn(fieldClassName)}
          data-invalid={hasError}
          data-disabled={disabled}
        >
          {label && (
            <FieldLabel htmlFor={props.id} className=" mb-0">
              {label}
              {required && (
                <span className="text-destructive" aria-label="required">
                  *
                </span>
              )}
            </FieldLabel>
          )}

          <FieldContent>
            <motion.div
              variants={containerVariants}
              animate={hasError ? 'error' : isFocused ? 'focused' : 'idle'}
              className="relative"
            >
              <InputGroup
                className={cn(
                  inputWithAdornmentsVariants({ size, radius, variant }),
                  hasError &&
                    'border-destructive ring-destructive/20 dark:ring-destructive/40',
                  isFocused &&
                    !hasError &&
                    'border-ring ring-ring/50 ring-[3px]',
                  disabled && 'opacity-50 cursor-not-allowed',
                  groupClassName,
                )}
                data-focused={isFocused}
                data-error={hasError}
              >
                {leftAdornment && (
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>{leftAdornment}</InputGroupText>
                  </InputGroupAddon>
                )}

                <InputGroupInput
                  ref={actualRef}
                  className={cn(
                    'bg-transparent border-0 shadow-none focus-visible:ring-0',
                    className,
                  )}
                  value={internalValue}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={disabled}
                  aria-invalid={hasError}
                  aria-describedby={
                    helperText || error
                      ? `${props.id}-description ${props.id}-error`.trim()
                      : undefined
                  }
                  {...props}
                />

                {(rightAdornment || showClearButton) && (
                  <InputGroupAddon align="inline-end">
                    <div className="flex items-center gap-1">
                      {rightAdornment && (
                        <InputGroupText>{rightAdornment}</InputGroupText>
                      )}

                      <AnimatePresence>
                        {showClearButton && (
                          <motion.div
                            variants={clearButtonVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            whileHover="hover"
                            whileTap={{ scale: disableAnimations ? 1 : 0.95 }}
                          >
                            <InputGroupButton
                              size="icon-xs"
                              variant="ghost"
                              onClick={handleClear}
                              aria-label="Clear input"
                              tabIndex={-1}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <XIcon className="w-3 h-3" />
                            </InputGroupButton>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </motion.div>

            {helperText && !error && (
              <FieldDescription id={`${props.id}-description`}>
                {helperText}
              </FieldDescription>
            )}

            {error && (
              <FieldError
                id={`${props.id}-error`}
                errors={
                  Array.isArray(error)
                    ? error.map(msg => ({ message: msg }))
                    : [{ message: error }]
                }
              />
            )}
          </FieldContent>
        </Field>
      );
    },
  ),
);

InputWithAdornments.displayName = 'InputWithAdornments';

export { InputWithAdornments, inputWithAdornmentsVariants };
