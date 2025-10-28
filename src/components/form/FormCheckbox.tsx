import { Checkbox } from '../ui/checkbox';
import { FormBase, FormControlProps } from './FormBase';
import { Control, Controller } from 'react-hook-form';

type FormCheckboxProps = FormControlProps & {
  control: Control<any>;
};

export function FormCheckbox({ control, name, ...props }: FormCheckboxProps) {
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
