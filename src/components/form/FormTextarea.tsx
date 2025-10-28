import { Textarea } from '../ui/textarea';
import { FormBase, FormControlProps } from './FormBase';
import { Control, Controller, FieldValues } from 'react-hook-form';

type FormTextareaProps<T extends FieldValues> = FormControlProps<T> & {
  control: Control<T>;
  placeholder?: string;
  rows?: number;
};

export function FormTextarea<T extends FieldValues = FieldValues>({
  control,
  name,
  placeholder,
  rows = 3,
  ...props
}: FormTextareaProps<T>) {
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
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={fieldState.invalid}
          />
        </FormBase>
      )}
    />
  );
}
