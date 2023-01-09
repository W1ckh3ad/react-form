import { useTsController } from "@ts-react/form";
import { InputHTMLAttributes, useCallback } from "react";
import { DefaultHTMLProps } from "src/types";
import { O } from "ts-toolbelt";

export type SelectProps = O.Merge<
  // Omit<InputHTMLAttributes<HTMLSelectElement>, "name" | "value">,
  Pick<
    InputHTMLAttributes<HTMLSelectElement>,
    "onChange" | "onBlur" | "readOnly" |"disabled"
  > &
    DefaultHTMLProps,
  {
    label?: string;
    enumValues: string[];
  }
>;

export default function Select(props: SelectProps) {
  const { onChange, onBlur, readOnly, label, enumValues, ...spreadProps } =
    props;
  const { field, error } = useTsController<number | string>();
  const handleChange = useCallback<
    Required<InputHTMLAttributes<HTMLSelectElement>>["onChange"]
  >(
    (e) => {
      const val = (e.target as any).value;
      field.onChange(val && typeof val !== "boolean" ? val : undefined);
      onChange?.(e);
    },
    [field.onChange, onChange]
  );
  const handleBlur = useCallback<
    Required<InputHTMLAttributes<HTMLSelectElement>>["onBlur"]
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
      <select
        value={field.value ? field.value + "" : ""}
        {...(readOnly || props.disabled
          ? {}
          : { onChange: handleChange, onBlur: handleBlur })}
        name={field.name}
        {...spreadProps}
      >
        {enumValues.map((x) => (
          <option value={x} key={x}>
            {x}
          </option>
        ))}
      </select>
      {error && <span>{error.errorMessage}</span>}
    </div>
  );
}
