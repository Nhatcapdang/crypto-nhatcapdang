import { Checkbox } from '../ui/checkbox';
import { FormBase, FormControlProps } from './FormBase';
import { Control, Controller, FieldValues } from 'react-hook-form';

type FormCheckboxProps<T extends FieldValues> = FormControlProps<T> & {
  control: Control<FieldValues>;
};

export function FormCheckbox<T extends FieldValues = FieldValues>({
  control,
  name,
  ...props
}: FormCheckboxProps<T>) {
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
          controlFirst
          horizontal
        >
          <Checkbox
            id={name}
            checked={field.value}
            onBlur={field.onBlur}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
          />
        </FormBase>
      )}
    />
  );
}
