import { useTsController } from "@ts-react/form";
import { InputHTMLAttributes, useCallback } from "react";
import { DefaultHTMLProps } from "src/types";
import { O } from "ts-toolbelt";

export type TextFieldProps = O.Merge<
  // Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "value">,
  Pick<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onBlur" | "readOnly" | "disabled"
  > &
    DefaultHTMLProps,
  { label?: string }
>;

export default function TextField(props: TextFieldProps) {
  console.log("textfieldprops", props);
  const { onChange, onBlur, readOnly, label, ...spreadProps } = props;
  const { field, error } = useTsController<number | string>();
  const handleChange = useCallback<
    Required<InputHTMLAttributes<HTMLInputElement>>["onChange"]
  >(
    (e) => {
      const val = (e.target as any).value;
      field.onChange(val && typeof val !== "boolean" ? val : undefined);
      onChange?.(e);
    },
    [field.onChange, onChange]
  );
  const handleBlur = useCallback<
    Required<InputHTMLAttributes<HTMLInputElement>>["onBlur"]
  >(
    (e) => {
      field.onBlur();
      onBlur?.(e);
    },
    [field.onBlur, onBlur]
  );

  return (
    <div className="border-blue border-1 border  p-4">
      <label>{label}</label>
      <input
        value={field.value ? field.value + "" : ""}
        {...(readOnly || props.disabled
          ? {}
          : { onChange: handleChange, onBlur: handleBlur })}
        readOnly={readOnly || false}
        name={field.name}
        {...spreadProps}
      />
      {error && <span>{error.errorMessage}</span>}
    </div>
  );
}
