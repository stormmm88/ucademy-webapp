import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex outline-none h-10 rounded-md px-3 bg-white w-full text-sm font-semibold  border border-gray-200 focus:!border-pri transition-all dark:border-gray-200/10 dark:bg-grayDarker focus-pri",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
