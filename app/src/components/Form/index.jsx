import Input from "../ui/Input";

const Form = ({ register, errors }) => {
  const inputs = [
    {
      name: "name",
      type: "text",
      placeholder: "Name",
    },
    {
      name: "surname",
      type: "text",
      placeholder: "Surname",
    },
    {
      name: "username",
      type: "text",
      placeholder: "Username",
    },
    {
      name: "email",
      type: "text",
      placeholder: "Email",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
    },
  ];

  return (
    <>
      {inputs.map((input, index) => {
        return (
          <Input
            key={index}
            name={input.name}
            type={input.type}
            placeholder={input.placeholder}
            register={register}
            error={errors?.[input.name]?.message}
          />
        );
      })}
    </>
  );
};
export default Form;
