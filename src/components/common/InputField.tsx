import { cn } from "../../lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 font-[Geologica] block font-light text-lg text-[#84B5FF]">
            {label}
          </label>
        )}
        <input
          className={cn(
            "w-full rounded-full border-0 bg-white px-4 py-3 text-base text-gray-900 placeholder:font-[Geologica] placeholder:font-extralight placeholder:text-lg placeholder:text-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-white/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField
