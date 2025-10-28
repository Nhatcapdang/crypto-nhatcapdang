import { FormBase, FormControlProps } from './FormBase';
import { ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Control, Controller, FieldValues } from 'react-hook-form';

type FormSelectProps<T extends FieldValues> = FormControlProps<T> & {
  control: Control<T>;
  children: ReactNode;
  placeholder?: string;
};

export function FormSelect<T extends FieldValues = FieldValues>({
  control,
  name,
  children,
  placeholder,
  ...props
}: FormSelectProps<T>) {
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
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger
              aria-invalid={fieldState.invalid}
              id={name}
              onBlur={field.onBlur}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>{children}</SelectContent>
          </Select>
        </FormBase>
      )}
    />
  );
}
