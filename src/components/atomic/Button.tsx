import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function Button({
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`whitespace-nowrap py-2 px-3 border-2 bg-background hover:underline border-primary text-primary disabled:text-foreground disabled:border-foreground transition-colors transition-100 ${className}`}
    >
      {children}
    </button>
  );
}
