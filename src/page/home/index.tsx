import Form, { Field } from "rc-field-form";
import "./index.css";
const Input = ({ ...props }) => <input {...props} />;

type A = {
  name: string;
  age: number;
};

type C = keyof A;

const c: C = "age";
console.log("c: ", c);

const Demo = () => {
  const [form] = Form.useForm<{ username: 1 }>();
  return (
    <Form<{ username: 1 }>
      form={form}
      onFinish={(values) => {
        console.log("Finish:", values);
      }}
      initialValues={{}}
    >
      <Field name="username">
        <Input placeholder="Username" />
      </Field>
      <Field name="password">
        <Input placeholder="Password" />
      </Field>

      <button>Submit</button>
    </Form>
  );
};

export default Demo;
