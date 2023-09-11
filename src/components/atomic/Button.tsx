import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`transition-100 whitespace-nowrap border-2 border-primary bg-background px-3 py-2 text-primary transition-colors hover:underline disabled:border-foreground disabled:text-foreground disabled:no-underline ${className}`}
    >
      {children}
    </button>
  );
}
