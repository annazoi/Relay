import "./style.css";

const Button = ({
  type = "button",
  label,
  onClick,
  style,
  className,
  variant = "primary",
  icon,
}) => {
  return (
    <button
      style={style}
      onClick={onClick}
      className={`button-container button-${variant} ${className}`}
      type={type}
    >
      {label}
      {icon && icon}
    </button>
  );
};

export default Button;
