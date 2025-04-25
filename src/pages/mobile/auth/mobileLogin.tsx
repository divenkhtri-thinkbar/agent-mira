import { ArrowLeft } from "lucide-react";
import type { FormEvent } from "react";
import { AuthLayout } from "@/layouts/AuthLayout";
import {
  GoogleButton,
  InputField,
  Separator,
  SubmitButton,
} from "@/components/common";
import Dropdown from "@/components/common/dropDown";

export function MobileLoginPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  return (
    <AuthLayout>
      <div className="w-full h-full rounded-tr-[32px] rounded-br-[32px] bg-[#1E54B7] relative">
        <div className="px-6">
          <h2 className="text-white text-[22px] font-[Geologica] font-medium mt-8">
            Sign up
          </h2>
        </div>
        <div className="rounded-br-2xl p-6 overflow-hidden">
          <div className="space-y-6 h-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="First name"
                    placeholder="Enter your first name"
                  />
                  <InputField
                    label="Last name"
                    placeholder="Enter your last name"
                  />
                </div>

                <InputField
                  label="Phone no."
                  placeholder="Enter your phone no."
                  type="tel"
                />

                <Dropdown />

                <InputField
                  label="Email - address"
                  placeholder="Enter your email ID"
                  type="email"
                />

                <div>
                  <InputField
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                  />

                  <p className="mt-2 font-[Geologica] font-thin text-[10px] leading-[12px] text-white text-wrap ">
                    Password should be a combination of at least 8 characters,
                    including uppercase, lowercase, numbers, and special
                    characters.
                  </p>
                </div>

                <div className="flex justify-end">
                  <SubmitButton text="Register" />
                </div>

                <Separator />
                {/* Bottom Buttons - Only GoogleButton remains in flex container */}
                <div className="flex items-center justify-end gap-4">
                  <GoogleButton />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="absolute left-[-11%] bottom-0  inline-flex bg-[#1E54B7] z-50 transition-colors items-center justify-center px-6 py-4 pb-6  rounded-tl-3xl">
          <a
            href="/auth/login"
            className="flex  font-[Geologica] font-medium text-[22px] items-center gap-4 text-white/90 hover:text-white text-nowrap"
          >
            <ArrowLeft className="h-8 w-8" />
            Back to log in
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
