import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-darkblue text-primary-foreground shadow-lg hover:shadow-xl hover:from-accent hover:to-primary",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-destructive-foreground shadow-lg hover:shadow-xl",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-md hover:shadow-lg",
        secondary:
          "bg-gradient-to-r from-lightblue to-accent text-secondary-foreground shadow-md hover:shadow-lg dark:from-gray-800 dark:to-gray-700",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium:
          "bg-gradient-to-r from-accent via-primary to-darkblue text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1",
      },
      size: {
        default: "h-11 px-8 py-3",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-10",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
