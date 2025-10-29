import { ComponentProps } from 'react';
import { Textarea } from '../ui/textarea';
import { FormBase, FormBaseFieldProps } from './FormBase';
import { Control, Controller, FieldValues } from 'react-hook-form';

type FormTextareaProps<T extends FieldValues> = FormControlProps<T> &
  ComponentProps<typeof Textarea> & {
    control: Control<T>;
  } & ComponentProps<typeof Textarea>;

export function FormTextarea<T extends FieldValues = FieldValues>({
  control,
  name,
  placeholder,
  rows = 3,
  fieldProps,
  label,
  description,
  ...textareaProps
}: FormTextareaProps<T> & {
  fieldProps?: FormBaseFieldProps;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormBase
          label={label}
          description={description}
          name={name}
          error={fieldState.error}
          isInvalid={fieldState.invalid}
          {...fieldProps}
        >
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={fieldState.invalid}
            {...textareaProps}
          />
        </FormBase>
      )}
    />
  );
}
