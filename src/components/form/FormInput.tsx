import { MailIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { FormBase, FormControlProps } from './FormBase';
import { Control, Controller } from 'react-hook-form';
import { ReactNode } from 'react';

type FormInputProps = FormControlProps & {
  control: Control<any>;
  type?: string;
  placeholder?: string;
  leftIcon?: string | ReactNode;
  rightIcon?: string | ReactNode;
};

export function FormInput({
  control,
  name,
  type = 'text',
  placeholder,
  leftIcon,
  rightIcon,
  ...props
}: FormInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormBase
          {...props}
          name={name}
          error={fieldState.error}
          isInvalid={fieldState.invalid}
        >
          <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring [&>*:first-child]:px-2 [&>*:last-child]:px-2 [&>input]:focus-visible:ring-0 [&>input]:border-0 [&>input]:shadow-none ">
            {leftIcon && (
              <span className="text-muted-foreground">{leftIcon}</span>
            )}
            <Input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
            />
            {rightIcon && (
              <span className="text-muted-foreground">{rightIcon}</span>
            )}
          </div>
        </FormBase>
      )}
    />
  );
}
