import z from "zod";
import { createTsForm, createUniqueFieldSchema } from "@ts-react/form";
import TextField from "../components/TextFIeld";
import TextArea from "../components/TextArea";
import Select from "../components/Select";
import SubmitButton from "../components/SubmitButton";

const textAreaStringSchema = createUniqueFieldSchema(z.string(), "TextArea");
const SelectStringSchema = createUniqueFieldSchema(z.string(), "Select");
const mapping = [
  [z.string(), TextField],
  [z.enum([""]), Select],
  [textAreaStringSchema, TextArea],
] as const;

const Form = createTsForm(mapping);

const schema = z.object({
  name1: z.string(),
  name2: textAreaStringSchema,
  name3: z.enum(["1", "2", "3"]),
});

export const SimpleExample = () => (
  <Form
    schema={schema}
    onSubmit={(e) => {
      console.log(e);
    }}
    renderAfter={() => <SubmitButton>Abschicken</SubmitButton>}
  />
);
