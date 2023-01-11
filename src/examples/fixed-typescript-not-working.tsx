import {
  createTsForm,
  createUniqueFieldSchema,
  RTFSupportedZodTypes,
} from "@ts-react/form";
import { ExtraProps } from "@ts-react/form/lib/src/createSchemaForm";
import { ComponentProps } from "react";
import z, {
  AnyZodObject,
  ZodBranded,
  ZodEffects,
  ZodEnum,
  ZodNullable,
  ZodOptional,
} from "zod";
import CheckBox from "../components/Checkbox";
import CustomSelect from "../components/CustomSelect";
import Select from "../components/Select";
import SubmitButton from "../components/SubmitButton";
import TextArea from "../components/TextArea";
import TextField from "../components/TextFIeld";

const textAreaStringSchema = createUniqueFieldSchema(z.string(), "TextArea2");
const SelectStringSchema = createUniqueFieldSchema(z.string(), "Select2");

const mapping = [
  [z.string(), TextField] as const,
  [z.enum([""]), Select] as const,
  [textAreaStringSchema, TextArea] as const,
  [z.boolean(), CheckBox] as const,
  [SelectStringSchema, CustomSelect] as const,
] as const;

// const test = [
//   [z.string(), 11] as const,
//   [z.string().brand("22"), 22] as const,
//   [z.string().brand("33"), 33] as const,
//   [z.string().brand("44"), 44] as const,
// ] as const;
// type ArrayTest = typeof test;

type GetComponentFromMapping<
  Mapping extends readonly any[],
  Target extends RTFSupportedZodTypes
> = Mapping extends readonly [
  readonly [infer Type, infer Return],
  ...infer Rest
]
  ? Target extends ZodBranded<infer X, infer Y>
    ? Type extends ZodBranded<infer X2, infer Y2>
      ? X extends X2
        ? Y extends Y2
          ? Return
          : GetComponentFromMapping<Rest, Target>
        : GetComponentFromMapping<Rest, Target>
      : GetComponentFromMapping<Rest, Target>
    : Target extends Type
    ? Return
    : GetComponentFromMapping<Rest, Target>
  : never;

// NonNullable to support optional types
/**
 * @internal
 */
type RequiredKeys<T> = {
  [K in keyof NonNullable<T>]-?: {} extends Pick<NonNullable<T>, K> ? never : K;
}[keyof NonNullable<T>];

type IsEmpty<T> = T[keyof T] extends never ? true : false;
type HasRequiredKey<T> = IsEmpty<RequiredKeys<T>> extends false ? true : false;
type KeysWithRequiredKeyList<T> = {
  [key in keyof T]-?: HasRequiredKey<T[key]> extends true ? key : never;
}[keyof T];

const HIDDEN_ID_PROPERTY = "_rtf_id";

/**
 * @internal
 */
type HiddenProperties = {
  [HIDDEN_ID_PROPERTY]: string;
};

function addHiddenProperties<T extends RTFSupportedZodTypes>(
  schema: T,
  properties: HiddenProperties
) {
  for (const key in properties) {
    (schema as any)[key] = properties[key as keyof typeof properties];
  }
  return schema;
}

function _createUniqueFieldSchema<
  T extends RTFSupportedZodTypes,
  Identifier extends string
>(schema: T, id: Identifier): ZodBranded<T, Identifier> {
  const r = schema.brand<Identifier>() as ZodBranded<T, Identifier>;
  return addHiddenProperties(r, { [HIDDEN_ID_PROPERTY]: id });
}

const Form = createTsForm(mapping);

const schema = z.object({
  name1: z.string(),
  name2: textAreaStringSchema,
  name3: SelectStringSchema,
  over18: z.boolean(),
  favoriteColor: z.enum(["blue", "red", "purple"]),
});

const defaultPropsMap = [
  ["name", "name"] as const,
  ["control", "control"] as const,
  ["enumValues", "enumValues"] as const,
] as const;

type PropsMapType = typeof defaultPropsMap;
type Mapping = typeof mapping;
type SchemaType = typeof schema;

type NewProps = RequireKeysWithRequiredChildren<
  Partial<{
    [Prop in keyof SchemaType["shape"]]: Omit<
      ComponentProps<
        GetComponentFromMapping<Mapping, SchemaType["shape"][Prop]>
      >,
      PropsMapType[number][1]
    > &
      ExtraProps;
  }>
>;

type OldProps = RequireKeysWithRequiredChildren<
  Partial<{
    [key in keyof z.infer<SchemaType>]: Mapping[IndexOf<
      Mapping,
      readonly [
        UnwrapZodType<
          ReturnType<UnwrapEffects<SchemaType>["_def"]["shape"]>[key]
        >,
        any
      ]
    >] extends readonly [any, any] // I guess this tells typescript it has a second element? errors without this check.
      ? Omit<
          ComponentProps<
            Mapping[IndexOf<
              Mapping,
              readonly [
                UnwrapZodType<
                  ReturnType<UnwrapEffects<SchemaType>["_def"]["shape"]>[key]
                >,
                any
              ]
            >][1]
          >,
          PropsMapType[number][1]
        > &
          ExtraProps
      : never;
  }>
>;

const newProps: NewProps = { name3: { customValues: [] } };
const newFailingProps: NewProps = {};
const oldProps1: OldProps = { name3: { customValues: [] } };
const oldProps2: OldProps = {};

export const HarderExample = () => (
  <Form
    schema={schema}
    onSubmit={(e) => {
      console.log(e);
    }}
    renderAfter={() => <SubmitButton>Abschicken</SubmitButton>}
  />
);

type UnwrapEffects<T extends AnyZodObject | ZodEffects<any, any>> =
  T extends AnyZodObject
    ? T
    : T extends ZodEffects<any, any>
    ? T["_def"]["schema"]
    : never;

type EnumAsAnyEnum<T extends RTFSupportedZodTypes> = T extends ZodEnum<any>
  ? ZodEnum<any>
  : T;

type UnwrapZodType<T extends RTFSupportedZodTypes> = T extends ZodOptional<any>
  ? EnumAsAnyEnum<T["_def"]["innerType"]>
  : T extends ZodNullable<any>
  ? T["_def"]["innerType"] extends ZodOptional<any>
    ? EnumAsAnyEnum<T["_def"]["innerType"]["_def"]["innerType"]>
    : EnumAsAnyEnum<T["_def"]["innerType"]>
  : EnumAsAnyEnum<T>;

/**
 * @internal
 */
type Require<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * @internal
 */
type RequireKeysWithRequiredChildren<T extends Record<string, any>> = T &
  Require<T, KeysWithRequiredKeyList<T>>;

/**
 * @internal
 */
type Indexes<V extends readonly any[]> = {
  [K in Exclude<keyof V, keyof Array<any>>]: K;
};

/**
 * @internal
 */
type IndexOf<V extends readonly any[], T> = {
  [I in keyof Indexes<V>]: V[I] extends T
    ? T extends V[I]
      ? I
      : never
    : never;
}[keyof Indexes<V>];
