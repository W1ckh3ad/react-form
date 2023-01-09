import { useTsController } from "@ts-react/form";
import { InputHTMLAttributes } from "react";
import { DefaultHTMLProps } from "src/types";
import { O } from "ts-toolbelt";

export type CheckboxProps = O.Merge<
  // Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "value">,
  DefaultHTMLProps,
  { label?: string }
>;

export default function CheckBox({ label }: CheckboxProps) {
  const { field, error } = useTsController<string>();
  return (
    <div className="border-blue border-1 border  p-4">
      <input
        type="checkbox"
        value={field.value ? field.value : "none"}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
      />{" "}
      {label}
      <span>{error?.errorMessage && error.errorMessage}</span>
    </div>
  );
}
