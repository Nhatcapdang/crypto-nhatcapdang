import { Control, Controller, FieldValues } from 'react-hook-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Input } from '.';
import { FormBase, FormBaseFieldProps } from '../form';
type NumberFormatterProps<T extends FieldValues> = FormControlProps<T> & {
  control: Control<T>;
} & NumericFormatProps;

export function NumberFormatter<T extends FieldValues = FieldValues>({
  control,
  name,
  placeholder,
  label,
  description,
  fieldProps,
  required,
  ...props
}: NumberFormatterProps<T> & {
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
          required={required}
          {...fieldProps}
        >
          <NumericFormat
            customInput={Input}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={placeholder}
            aria-label={name}
            aria-invalid={fieldState.invalid}
            {...props}
          />
        </FormBase>
      )}
    />
  );
}
