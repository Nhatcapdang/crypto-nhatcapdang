import { Textarea } from "../ui/textarea"
import { FormBase, FormControlProps } from "./FormBase"
import { Control, Controller } from "react-hook-form"

type FormTextareaProps = FormControlProps & {
  control: Control<any>
  placeholder?: string
  rows?: number
}

export function FormTextarea({ control, name, placeholder, rows = 3, ...props }: FormTextareaProps) {
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
  )
}
