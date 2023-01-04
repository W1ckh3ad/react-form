import { PropsWithChildren } from "react";

export default function SubmitButton({ children }: PropsWithChildren<{}>) {
  return <button type="submit">{children}</button>;
}
