import "./style.css";
const Input = ({
  name,
  type = "text",
  placeholder,
  value,
  props,
  register,
  error,
  className = "",
  onChange,
}) => {
  return (
    <>
      <input
        className={`input-container ${className}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
        {...register(name)}
      />
      {error && <p className="error-container">{error}</p>}
    </>
  );
};

export default Input;
