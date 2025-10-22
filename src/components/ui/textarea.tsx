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

/**
 * Variants for the textarea container styling
 */
const textareaVariants = cva(
  'group/textarea-enhanced transition-all duration-200 ease-out',
  {
    variants: {
      size: {
        sm: 'min-h-16 text-sm [&_textarea]:min-h-16 [&_textarea]:text-sm [&_textarea]:px-2.5 [&_textarea]:py-1.5',
        md: 'min-h-20 text-sm [&_textarea]:min-h-20 [&_textarea]:text-sm [&_textarea]:px-3 [&_textarea]:py-2',
        lg: 'min-h-24 text-base [&_textarea]:min-h-24 [&_textarea]:text-base [&_textarea]:px-3.5 [&_textarea]:py-2.5',
        xl: 'min-h-32 text-base [&_textarea]:min-h-32 [&_textarea]:text-base [&_textarea]:px-4 [&_textarea]:py-3',
      },
      radius: {
        none: 'rounded-none [&_textarea]:rounded-none',
        sm: 'rounded-sm [&_textarea]:rounded-sm',
        md: 'rounded-md [&_textarea]:rounded-md',
        lg: 'rounded-lg [&_textarea]:rounded-lg',
        xl: 'rounded-xl [&_textarea]:rounded-xl',
      },
      variant: {
        outline: 'border-input bg-transparent',
        filled:
          'border-transparent bg-muted/50 hover:bg-muted/70 focus-within:bg-background focus-within:border-input',
        ghost:
          'border-transparent bg-transparent hover:bg-muted/30 focus-within:bg-muted/50 focus-within:border-input',
      },
      resize: {
        none: '[&_textarea]:resize-none',
        vertical: '[&_textarea]:resize-y',
        horizontal: '[&_textarea]:resize-x',
        both: '[&_textarea]:resize',
      },
    },
    defaultVariants: {
      size: 'md',
      radius: 'md',
      variant: 'outline',
      resize: 'vertical',
    },
  },
);

/**
 * Props for the Textarea component
 */
export interface TextareaEnhancedProps
  extends Omit<React.ComponentProps<'textarea'>, 'size'>,
    VariantProps<typeof textareaVariants> {
  /** Label text for the textarea */
  label?: string | React.ReactNode;
  /** Helper text displayed below the textarea */
  helperText?: string;
  /** Error message to display */
  error?: string | string[];
  /** Whether to show a clear button when textarea has value */
  clearable?: boolean;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Whether the textarea is in an error state */
  isInvalid?: boolean;
  /** Custom className for the field container */
  fieldClassName?: string;
  /** Custom className for the textarea container */
  containerClassName?: string;
  /** Whether to disable animations */
  disableAnimations?: boolean;
  /** Character count limit */
  maxLength?: number;
  /** Whether to show character counter */
  showCharacterCount?: boolean;
  /** Whether the field is required */
  required?: boolean;
}

/**
 * Enhanced Textarea component with label, helper text, error states, and animations
 *
 * @example
 * Controlled usage:
 * ```tsx
 * const [value, setValue] = React.useState('');
 *
 * <Textarea
 *   label="Description"
 *   placeholder="Enter description..."
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 *   helperText="Provide a detailed description"
 *   maxLength={500}
 *   showCharacterCount
 * />
 * ```
 *
 * @example
 * Uncontrolled usage:
 * ```tsx
 * <Textarea
 *   label="Comments"
 *   placeholder="Enter your comments..."
 *   defaultValue=""
 *   helperText="Share your thoughts"
 * />
 * ```
 *
 * @example
 * With error state:
 * ```tsx
 * <Textarea
 *   label="Message"
 *   error="Message is required"
 *   isInvalid
 * />
 * ```
 *
 * @example
 * Disabled state:
 * ```tsx
 * <Textarea
 *   label="Readonly Content"
 *   value="This content cannot be edited"
 *   disabled
 * />
 * ```
 */
const Textarea = React.memo(
  React.forwardRef<HTMLTextAreaElement, TextareaEnhancedProps>(
    (
      {
        className,
        fieldClassName,
        containerClassName,
        size = 'md',
        radius = 'md',
        variant = 'outline',
        resize = 'vertical',
        label,
        helperText,
        error,
        clearable = false,
        onClear,
        isInvalid,
        disableAnimations = false,
        value,
        onChange,
        disabled,
        maxLength,
        showCharacterCount = false,
        required = false,
        id,
        ...props
      },
      ref,
    ) => {
      const [internalValue, setInternalValue] = React.useState(
        value?.toString() || props.defaultValue?.toString() || '',
      );
      const [isFocused, setIsFocused] = React.useState(false);
      const textareaRef = React.useRef<HTMLTextAreaElement>(null);

      // Generate a unique ID if not provided
      const textareaId = React.useMemo(
        () => id || `textarea-${Math.random().toString(36).substr(2, 9)}`,
        [id],
      );

      // Use forwarded ref or internal ref
      const actualRef = ref || textareaRef;

      // Sync internal value with external value (controlled mode)
      React.useEffect(() => {
        if (value !== undefined) {
          setInternalValue(value.toString());
        }
      }, [value]);

      const hasValue = Boolean(
        internalValue && String(internalValue).length > 0,
      );
      const showClearButton = clearable && hasValue && !disabled;
      const hasError = Boolean(error) || isInvalid;

      const characterCount = internalValue.length;
      const showCounter =
        showCharacterCount && (maxLength || characterCount > 0);

      const handleTextareaChange = React.useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
          } as React.ChangeEvent<HTMLTextAreaElement>;
          onChange(syntheticEvent);
        }

        // Focus textarea after clearing
        if (actualRef && 'current' in actualRef && actualRef.current) {
          actualRef.current.focus();
        }
      }, [onClear, onChange, actualRef]);

      const handleFocus = React.useCallback(
        (e: React.FocusEvent<HTMLTextAreaElement>) => {
          setIsFocused(true);
          props.onFocus?.(e);
        },
        [props],
      );

      const handleBlur = React.useCallback(
        (e: React.FocusEvent<HTMLTextAreaElement>) => {
          setIsFocused(false);
          props.onBlur?.(e);
        },
        [props],
      );

      // Animation variants
      const containerVariants: Variants = {
        idle: { scale: 1 },
        focused: {
          scale: disableAnimations ? 1 : 1.005,
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

      const counterVariants: Variants = {
        normal: { color: 'currentColor' },
        warning: {
          color: 'hsl(var(--warning))',
          transition: { duration: 0.2 },
        },
        danger: {
          color: 'hsl(var(--destructive))',
          transition: { duration: 0.2 },
        },
      };

      const getCounterState = () => {
        if (!maxLength) return 'normal';
        const percentage = (characterCount / maxLength) * 100;
        if (percentage >= 100) return 'danger';
        if (percentage >= 80) return 'warning';
        return 'normal';
      };

      return (
        <Field
          className={cn('space-y-2', fieldClassName)}
          data-invalid={hasError}
          data-disabled={disabled}
        >
          {label && (
            <FieldLabel htmlFor={textareaId} className=" mb-0">
              {label}
              {required && (
                <span className="text-destructive ml-0.5" aria-label="required">
                  *
                </span>
              )}
            </FieldLabel>
          )}

          <FieldContent>
            <motion.div
              variants={containerVariants}
              animate={hasError ? 'error' : isFocused ? 'focused' : 'idle'}
              className={cn('relative', containerClassName)}
            >
              <div
                className={cn(
                  textareaVariants({ size, radius, variant, resize }),
                  'relative rounded-md border transition-all duration-200',
                  hasError &&
                    'border-destructive ring-destructive/20 dark:ring-destructive/40 ring-[3px]',
                  isFocused &&
                    !hasError &&
                    'border-ring ring-ring/50 ring-[3px]',
                  disabled && 'opacity-50 cursor-not-allowed',
                  'group',
                )}
                data-focused={isFocused}
                data-error={hasError}
              >
                <textarea
                  data-slot="textarea"
                  ref={actualRef}
                  id={textareaId}
                  className={cn(
                    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md  bg-transparent px-3 py-2 text-base  transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0 shadow-none focus-visible:ring-0 focus-visible:border-0',
                    showClearButton && 'pr-10',
                    className,
                  )}
                  value={value !== undefined ? value : internalValue}
                  onChange={handleTextareaChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={disabled}
                  maxLength={maxLength}
                  aria-invalid={hasError}
                  aria-required={required}
                  aria-describedby={
                    helperText || error || showCounter
                      ? `${textareaId}-description ${textareaId}-error ${textareaId}-counter`.trim()
                      : undefined
                  }
                  {...props}
                />

                <AnimatePresence>
                  {showClearButton && (
                    <motion.button
                      type="button"
                      variants={clearButtonVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileHover="hover"
                      whileTap={{ scale: disableAnimations ? 1 : 0.95 }}
                      onClick={handleClear}
                      aria-label="Clear textarea"
                      tabIndex={-1}
                      className={cn(
                        'absolute top-2 right-2 z-10',
                        'text-muted-foreground hover:text-foreground',
                        'bg-background hover:bg-muted',
                        'rounded-md p-1.5',
                        'transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                      )}
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {showCounter && (
                <motion.div
                  id={`${textareaId}-counter`}
                  variants={counterVariants}
                  animate={getCounterState()}
                  className={cn(
                    'absolute bottom-2 right-2 text-xs font-medium',
                    'px-2 py-0.5 rounded-md',
                    'bg-background/80 backdrop-blur-sm',
                    'border border-border/50',
                    'pointer-events-none select-none',
                  )}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {characterCount}
                  {maxLength && ` / ${maxLength}`}
                </motion.div>
              )}
            </motion.div>

            {helperText && !error && (
              <FieldDescription id={`${textareaId}-description`}>
                {helperText}
              </FieldDescription>
            )}

            {error && (
              <FieldError
                id={`${textareaId}-error`}
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

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
export default Textarea;
