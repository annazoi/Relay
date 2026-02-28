import "./style.css";

const Textarea = ({
  name,
  type = "",
  placeholder,
  value,
  props,
  register,
  error,
  className = "",
}) => {
  return (
    <textarea
      className={`text-area ${className}`}
      type={`text ${type}`}
      placeholder={placeholder}
      value={value}
      {...props}
      {...register(name)}></textarea>
  );
};

export default Textarea;
