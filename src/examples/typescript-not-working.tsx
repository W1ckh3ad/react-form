import { createTsForm, createUniqueFieldSchema } from "@ts-react/form";
import z from "zod";
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

const Form = createTsForm(mapping);

const schema = z.object({
  name1: z.string(),
  name2: textAreaStringSchema,
  name3: SelectStringSchema,
  over18: z.boolean(),
  favoriteColor: z.enum(["blue", "red", "purple"]),
});

export const HarderExample = () => (
  <Form
    schema={schema}
    onSubmit={(e) => {
      console.log(e);
    }}
    renderAfter={() => <SubmitButton>Abschicken</SubmitButton>}
  />
);
