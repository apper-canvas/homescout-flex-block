import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className, 
  children,
  error,
  ...props 
}, ref) => {
  return (
    <select
      className={cn(
        "flex w-full px-3 py-2 text-base bg-white border border-gray-300 rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
        error && "border-error focus:ring-error/50 focus:border-error",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;