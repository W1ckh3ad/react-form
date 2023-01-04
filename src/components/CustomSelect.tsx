import { useTsController } from "@ts-react/form";
import { InputHTMLAttributes, useCallback } from "react";

export default function CustomSelect(
  props: InputHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    customValues: string[];
  }
) {
  const { onChange, onBlur, readOnly, label, customValues, ...spreadProps } =
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
        {customValues.map((x) => (
          <option value={x} key={x}>
            {x}
          </option>
        ))}
      </select>
      {error && <span>{error.errorMessage}</span>}
    </div>
  );
}
