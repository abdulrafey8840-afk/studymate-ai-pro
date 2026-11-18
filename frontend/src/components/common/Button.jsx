function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      className={`app-button ${variant}`}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

export default Button;