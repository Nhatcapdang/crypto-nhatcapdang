import { ReactNode } from 'react';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../ui/field';
import {
  FieldPath,
  FieldValues,
  FieldError as RHFFieldError,
} from 'react-hook-form';

export type FormControlProps<T extends FieldValues = FieldValues> = {
  label: string;
  description?: string;
  name: FieldPath<T>;
  error?: RHFFieldError;
  isInvalid?: boolean;
};

type FormBaseProps<T extends FieldValues> = FormControlProps<T> & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
};

export function FormBase<T extends FieldValues = FieldValues>({
  children,
  label,
  description,
  controlFirst,
  horizontal,
  name,
  error,
  isInvalid = false,
}: FormBaseProps<T>) {
  const labelElement = (
    <>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  );
  const errorElem = isInvalid && error && <FieldError errors={[error]} />;

  return (
    <Field
      data-invalid={isInvalid}
      orientation={horizontal ? 'horizontal' : undefined}
    >
      {controlFirst ? (
        <>
          {children}
          <FieldContent>
            {labelElement}
            {errorElem}
          </FieldContent>
        </>
      ) : (
        <>
          <FieldContent>{labelElement}</FieldContent>
          {children}
          {errorElem}
        </>
      )}
    </Field>
  );
}
