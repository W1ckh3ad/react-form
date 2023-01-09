import { CSSProperties } from "react";

export type Merge<F, S> = {
  [P in keyof F | keyof S]: P extends keyof S
    ? S[P]
    : P extends keyof F
    ? F[P]
    : never;
};

export type DefaultHTMLProps = {
  className?: string;
  style?: CSSProperties;
  id?: string;
};
