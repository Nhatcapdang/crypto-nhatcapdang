import { ReactNode } from 'react';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../ui/field';
import { FieldError as RHFFieldError } from 'react-hook-form';

export type FormControlProps = {
  label: string;
  description?: string;
  name: string;
  error?: RHFFieldError;
  isInvalid?: boolean;
};

type FormBaseProps = FormControlProps & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
};

export function FormBase({
  children,
  label,
  description,
  controlFirst,
  horizontal,
  name,
  error,
  isInvalid = false,
}: FormBaseProps) {
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
